<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $genres = [
            'Hành Động', 'Kinh Dị', 'Hài Hước', 'Tình Cảm',
            'Khoa Học Viễn Tưởng', 'Lịch Sử', 'Phiêu Lưu', 'Hoạt Hình',
            'Tâm Lý', 'Viễn Tây', 'Giật Gân', 'Âm Nhạc'
        ];

        $adjectives = [
            'Vĩ Đại', 'Huyền Bí', 'Cuối Cùng', 'Bí Ẩn', 'Mất Tích',
            'Định Mệnh', 'Thần Bí', 'Kinh Hoàng', 'Bất Tận', 'Ánh Sáng',
            'Tàn Khốc', 'Giải Cứu', 'Tái Sinh', 'Phục Thù', 'Khởi Nguồn'
        ];

        $nouns = [
            'Chiến Binh', 'Trái Đất', 'Người Hùng', 'Bóng Đêm', 'Kẻ Săn Mồi',
            'Thiên Thần', 'Ác Quỷ', 'Cơn Mưa', 'Giấc Mơ', 'Hành Trình',
            'Thời Gian', 'Thế Giới', 'Bầu Trời', 'Ngọn Lửa', 'Biển Cả'
        ];

        $desc_templates = [
            'Bộ phim kể về hành trình của {hero} trong thế giới {genre}, nơi mọi thứ đều bị đảo lộn.',
            'Một câu chuyện đầy cảm xúc về tình bạn, niềm tin và sự hy sinh.',
            '{hero} đối mặt với những thử thách vượt ngoài sức tưởng tượng để bảo vệ {target}.',
            'Bộ phim đưa người xem vào thế giới {genre} đầy hồi hộp và bất ngờ.',
            'Tác phẩm mang đến trải nghiệm mãn nhãn với hình ảnh và âm thanh đỉnh cao.',
            'Một cuộc phiêu lưu không thể bỏ qua dành cho người yêu thích {genre}.'
        ];

        $fixedImage = 'ttkien.webp'; // 📌 ảnh cố định cho tất cả phim
        $movies = [];

        for ($i = 1; $i <= 1000; $i++) {
            $genre = $genres[array_rand($genres)];
            $title = "{$nouns[array_rand($nouns)]} {$adjectives[array_rand($adjectives)]}";
            $hero = $nouns[array_rand($nouns)];
            $target = $nouns[array_rand($nouns)];
            $desc = str_replace(
                ['{hero}', '{genre}', '{target}'],
                [$hero, strtolower($genre), $target],
                $desc_templates[array_rand($desc_templates)]
            );

            $movies[] = [
                'title' => $title,
                'genre' => $genre,
                'price' => rand(20000, 200000),
                'image' => $fixedImage, // tất cả dùng 1 ảnh
                'description' => $desc,
                'new' => rand(0, 1),
                'created_at' => Carbon::now()->subDays(rand(0, 365)),
                'updated_at' => Carbon::now()->subDays(rand(0, 365)),
            ];
        }

        DB::table('movies')->insert($movies);
    }
}
