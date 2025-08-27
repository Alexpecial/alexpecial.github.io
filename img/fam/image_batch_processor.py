import os
import shutil
from datetime import datetime
from PIL import Image
from PIL.ExifTags import TAGS
import pillow_heif
from pathlib import Path
import numpy as np

# HEIC 지원 등록
pillow_heif.register_heif_opener()

# rawpy import 시도
try:
    import rawpy
    RAWPY_AVAILABLE = True
except ImportError:
    RAWPY_AVAILABLE = False
    print("경고: rawpy가 설치되지 않았습니다. RAW 파일 처리가 제한될 수 있습니다.")
    print("설치하려면: pip install rawpy")

def get_image_date(image_path):
    """이미지의 촬영 날짜를 EXIF 데이터에서 추출"""
    try:
        # RAW 파일인 경우 rawpy로 메타데이터 추출 시도
        if RAWPY_AVAILABLE and image_path.lower().endswith(('.rw2', '.nef', '.cr2', '.arw', '.dng')):
            try:
                with rawpy.imread(image_path) as raw:
                    # rawpy는 직접적인 EXIF 접근이 제한적이므로 PIL로 처리 시도
                    rgb = raw.postprocess()
                    image = Image.fromarray(rgb)
            except:
                image = Image.open(image_path)
        else:
            image = Image.open(image_path)
        
        exifdata = image.getexif()
        
        # EXIF 태그에서 날짜 정보 찾기
        date_tags = ['DateTimeOriginal', 'DateTime', 'DateTimeDigitized']
        
        for tag, value in exifdata.items():
            tag_name = TAGS.get(tag, tag)
            if tag_name in date_tags and value:
                # 날짜 형식: '2024:09:18 10:30:45' -> '20240918'
                try:
                    date_obj = datetime.strptime(value.split()[0], '%Y:%m:%d')
                    return date_obj.strftime('%Y%m%d')
                except:
                    continue
        
        # EXIF 데이터가 없으면 파일 수정 날짜 사용
        mod_time = os.path.getmtime(image_path)
        return datetime.fromtimestamp(mod_time).strftime('%Y%m%d')
    except:
        # 오류 발생시 파일 수정 날짜 사용
        mod_time = os.path.getmtime(image_path)
        return datetime.fromtimestamp(mod_time).strftime('%Y%m%d')

def open_image_file(file_path):
    """다양한 포맷의 이미지 파일 열기 (RAW 포함)"""
    # RAW 파일 확장자 목록
    raw_extensions = {'.rw2', '.nef', '.cr2', '.cr3', '.arw', '.dng', '.orf', '.raf', '.raw'}
    
    file_ext = os.path.splitext(file_path)[1].lower()
    
    if RAWPY_AVAILABLE and file_ext in raw_extensions:
        try:
            with rawpy.imread(file_path) as raw:
                # RAW 파일을 RGB 이미지로 변환
                rgb = raw.postprocess(
                    use_camera_wb=True,  # 카메라 화이트 밸런스 사용
                    half_size=False,      # 전체 해상도 유지
                    no_auto_bright=False, # 자동 밝기 조정
                    output_bps=8          # 8비트 출력
                )
                return Image.fromarray(rgb)
        except Exception as e:
            print(f"  RAW 처리 실패, PIL로 시도: {str(e)}")
            return Image.open(file_path)
    else:
        return Image.open(file_path)

def optimize_image(image, max_size_mb=3, max_dimension=4096):
    """이미지 크기와 용량 최적화 (4096px 기준)"""
    # 현재 이미지 크기
    width, height = image.size
    
    # 긴 쪽이 4096을 초과하는 경우에만 리사이징
    max_side = max(width, height)
    if max_side > max_dimension:
        # 비율 유지하면서 리사이징
        ratio = max_dimension / max_side
        new_width = int(width * ratio)
        new_height = int(height * ratio)
        image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        print(f"    리사이즈: {width}x{height} -> {new_width}x{new_height}")
    
    # RGBA를 RGB로 변환 (JPG는 알파 채널 지원 안함)
    if image.mode in ('RGBA', 'LA', 'P'):
        # 흰색 배경 생성
        background = Image.new('RGB', image.size, (255, 255, 255))
        if image.mode == 'P':
            image = image.convert('RGBA')
        background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
        image = background
    elif image.mode != 'RGB':
        image = image.convert('RGB')
    
    return image

def save_with_size_limit(image, output_path, max_size_mb=3):
    """지정된 용량 제한 내에서 이미지 저장"""
    max_size_bytes = max_size_mb * 1024 * 1024
    
    # 초기 품질 설정
    quality = 95
    
    # 임시 파일로 저장하면서 크기 확인
    temp_path = output_path + '.tmp'
    
    # 먼저 높은 품질로 시도
    while quality >= 70:
        image.save(temp_path, 'JPEG', quality=quality, optimize=True)
        file_size = os.path.getsize(temp_path)
        
        if file_size <= max_size_bytes:
            # 크기가 적절하면 최종 파일로 이동
            shutil.move(temp_path, output_path)
            print(f"    저장 완료 (품질: {quality}%, 크기: {file_size/1024/1024:.2f}MB)")
            return True
        
        # 품질 감소
        quality -= 5
    
    # 품질을 70까지 낮춰도 크기가 큰 경우, 추가 리사이징
    width, height = image.size
    scale = 0.9
    
    while scale >= 0.5:
        resized = image.resize((int(width * scale), int(height * scale)), Image.Resampling.LANCZOS)
        resized.save(temp_path, 'JPEG', quality=75, optimize=True)
        file_size = os.path.getsize(temp_path)
        
        if file_size <= max_size_bytes:
            shutil.move(temp_path, output_path)
            print(f"    추가 리사이즈 후 저장 (스케일: {scale:.1%}, 크기: {file_size/1024/1024:.2f}MB)")
            return True
        
        scale -= 0.1
    
    # 최소 크기로 저장
    resized.save(output_path, 'JPEG', quality=70, optimize=True)
    file_size = os.path.getsize(output_path)
    print(f"    최소 설정으로 저장 (크기: {file_size/1024/1024:.2f}MB)")
    
    if os.path.exists(temp_path):
        os.remove(temp_path)
    return True

def process_images(input_folder, output_folder):
    """폴더 내 모든 이미지 처리"""
    # 지원하는 이미지 확장자 (RAW 포함)
    image_extensions = {
        # 일반 이미지 포맷
        '.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff', '.tif', 
        '.heic', '.heif', '.webp',
        # RAW 포맷
        '.rw2', '.nef', '.cr2', '.cr3', '.arw', '.dng', '.orf', '.raf', '.raw',
        # 대문자 버전
        '.JPG', '.JPEG', '.PNG', '.HEIC', '.RW2', '.NEF', '.CR2', '.ARW', '.DNG'
    }
    
    # 출력 폴더 생성
    os.makedirs(output_folder, exist_ok=True)
    
    # 처리된 파일 수 추적
    processed = 0
    errors = []
    
    # 날짜별 파일 카운터
    date_counters = {}
    
    # 처리할 이미지 파일 목록 생성
    image_files = []
    for file in os.listdir(input_folder):
        file_path = os.path.join(input_folder, file)
        if os.path.isfile(file_path):
            ext = os.path.splitext(file)[1].lower()
            if ext in [e.lower() for e in image_extensions]:
                image_files.append(file_path)
    
    print(f"총 {len(image_files)}개의 이미지 파일을 발견했습니다.")
    if RAWPY_AVAILABLE:
        print("RAW 파일 처리가 활성화되었습니다.")
    
    # 각 이미지 파일 처리
    for idx, file_path in enumerate(image_files, 1):
        try:
            file_name = os.path.basename(file_path)
            print(f"\n처리 중 ({idx}/{len(image_files)}): {file_name}")
            
            # 1. 이미지 열기 (RAW 포함)
            image = open_image_file(file_path)
            
            # 2. 촬영 날짜 가져오기
            date_str = get_image_date(file_path)
            
            # 3. 새 파일명 생성
            if date_str not in date_counters:
                date_counters[date_str] = 0
            
            date_counters[date_str] += 1
            
            if date_counters[date_str] == 1:
                new_filename = f"{date_str}.jpg"
            else:
                new_filename = f"{date_str}_{date_counters[date_str]-1}.jpg"
            
            new_path = os.path.join(output_folder, new_filename)
            
            # 4. 이미지 최적화 (4096px 기준)
            optimized_image = optimize_image(image, max_dimension=4096)
            
            # 5. 크기 제한으로 저장
            save_with_size_limit(optimized_image, new_path, max_size_mb=3)
            
            print(f"  ✓ 완료: {file_name} -> {new_filename}")
            processed += 1
            
        except Exception as e:
            error_msg = f"오류 - {os.path.basename(file_path)}: {str(e)}"
            errors.append(error_msg)
            print(f"  ✗ {error_msg}")
    
    # 결과 요약
    print("\n" + "="*50)
    print(f"처리 완료!")
    print(f"성공: {processed}개 파일")
    print(f"오류: {len(errors)}개 파일")
    print(f"출력 폴더: {output_folder}")
    
    if errors:
        print("\n오류 상세:")
        for error in errors:
            print(f"  - {error}")

def main():
    # 처리할 폴더 경로 지정
    input_folder = r"/Users/roger/SynologyDrive/GitHub/alexpecial.github.io/img/fam"   # 원본 이미지 폴더
    output_folder = r"/Users/roger/SynologyDrive/GitHub/alexpecial.github.io/img/fam/processed" # 처리된 이미지 저장 폴더
    
    # 폴더 존재 확인
    if not os.path.exists(input_folder):
        print(f"오류: 입력 폴더를 찾을 수 없습니다 - {input_folder}")
        return
    
    print(f"입력 폴더: {input_folder}")
    print(f"출력 폴더: {output_folder}")
    print("="*50)
    
    # 사용자 확인
    print("\n설정:")
    print("- 최대 이미지 크기: 4096px (긴 쪽 기준)")
    print("- 최대 파일 크기: 3MB")
    print("- 출력 형식: JPG")
    print("- 파일명 형식: YYYYMMDD.jpg")
    
    response = input("\n처리를 시작하시겠습니까? (y/n): ")
    if response.lower() != 'y':
        print("처리가 취소되었습니다.")
        return
    
    # 이미지 처리 실행
    process_images(input_folder, output_folder)

if __name__ == "__main__":
    # 필요한 라이브러리 설치 안내
    print("필요한 라이브러리:")
    print("pip install Pillow pillow-heif")
    print("pip install rawpy  # RAW 파일 처리용 (선택사항)")
    print()
    
    main()
