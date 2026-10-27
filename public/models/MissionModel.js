/**
 * ==============================================================================
 * MAT SMA / EXPO CITY - MISSION MODEL (models/MissionModel.js)
 * ==============================================================================
 * Mengelola Misi Utama:
 * - District 1: Eco Dome (Persis sesuai dokumen SKRIPSI PDF 13 Halaman)
 * - District 2: Expo Central Control Lab
 * ==============================================================================
 */

class MissionModel {
  constructor() {
    this.districts = [
      {
        level: 1,
        id: 'escape-district-1',
        title: 'District 1: Eco Dome',
        sector: 'DISTRICT 01 // ECO DOME',
        rewardXp: 150,
        stagesCount: 7, // 7 Halaman pengerjaan + Halaman 8 (Rekaman)
        stages: [
          // ----------------------------------------------------
          // HALAMAN 1: Orientasi Siswa pada Masalah
          // ----------------------------------------------------
          {
            stageNum: 1,
            phaseTitle: 'Orientasi Siswa pada Masalah',
            robotGreeting: 'Hai, Explorer! Ada gangguan di Eco Dome, nih! Sistem pemantauan mengalami gangguan sehingga jumlah organisme yang tersisa di ruang utama tidak dapat diketahui.',
            storyText: 'Pada pukul 08.00 terdapat 2 organisme Hydra Cells di ruang utama. Setelah diamati, masing-masing organisme Hydra Cells dapat membelah diri menjadi tiga kali lipat setiap 60 menit dan berakhir pada pukul 12.00. Setelah proses pembelahan selesai, setengah dari seluruh organisme dipindahkan ke ruang penyimpanan.',
            robotPrompt: 'Bantulah sistem menentukan jumlah organisme yang tersisa di ruang utama pada pukul 12.00!',
            riddle: 'Coba amati masalah yang terjadi di Eco Dome. Apa masalah utama yang harus diselesaikan dalam District Eco Dome?',
            options: [
              { key: 'A', text: 'Menentukan waktu yang diperlukan organisme Hydra Cells untuk membelah diri.' },
              { key: 'B', text: 'Menentukan jumlah organisme Hydra Cells yang tersisa di ruang utama setelah pemindahan pada pukul 12.00.' },
              { key: 'C', text: 'Menentukan jumlah ruang penyimpanan yang diperlukan untuk menampung organisme Hydra Cells.' },
              { key: 'D', text: 'Menentukan jumlah organisme Hydra Cells yang dipindahkan pada pukul 08.00.' }
            ],
            correctKey: 'B',
            feedbackCorrect: 'Bagus! Kamu telah mengenali masalah utama. Sekarang, identifikasi informasi yang dapat digunakan untuk menyelesaikannya.',
            feedbackWrong: 'Sayang sekali, jawabanmu kurang tepat. Perhatikan kembali tujuan yang disampaikan oleh maskot robot.'
          },

          // ----------------------------------------------------
          // HALAMAN 2: Mengorganisasikan Siswa untuk Belajar
          // ----------------------------------------------------
          {
            stageNum: 2,
            phaseTitle: 'Mengorganisasikan Siswa untuk Belajar',
            robotGreeting1: 'Silakan berkelompok sebanyak 4 orang berdasarkan tempat duduk kalian dan diskusikan permasalahan Eco Dome ini. Jangan lupa saling membantu sesama teman ya!',
            robotGreeting2: 'Sebelum memulai perhitungan, kita perlu mengumpulkan petunjuk terlebih dahulu, Explorer! 🔎',
            storyRecapTitle: '“GANGGUAN SISTEM ECO DOME!',
            storyRecapText: 'Sistem pemantauan mengalami gangguan sehingga jumlah organisme yang tersisa di ruang utama tidak dapat diketahui.\n\nPada pukul 08.00 terdapat 2 organisme Hydra Cells di ruang utama. Setelah diamati, masing-masing organisme Hydra Cells dapat membelah diri menjadi tiga kali lipat setiap 60 menit dan berakhir pada pukul 12.00.\n\nSetelah proses pembelahan selesai, setengah dari seluruh organisme dipindahkan ke ruang penyimpanan. Bantulah sistem menentukan jumlah organisme yang tersisa di ruang utama pada pukul 12.00!”',
            instruction: 'Explorer yang terhormat! Pilihlah jawaban yang benar untuk bagian “Diketahui” dan “Ditanyakan”! (jawaban lebih dari satu)',
            diketahuiOptions: [
              { id: 'd1', text: 'Setengah dari seluruh organisme dipindahkan ke ruang penyimpanan setiap 60 menit.', isCorrect: false },
              { id: 'd2', text: 'Pada pukul 08.00 terdapat 2 organisme Hydra Cells di ruang utama.', isCorrect: true },
              { id: 'd3', text: 'Jumlah organisme menjadi tiga kali lipat setiap 60 menit.', isCorrect: true },
              { id: 'd4', text: 'Pengamatan berlangsung selama 3 jam.', isCorrect: false },
              { id: 'd5', text: 'Setelah proses pembelahan selesai, setengah dari seluruh organisme dipindahkan ke ruang penyimpanan.', isCorrect: true },
              { id: 'd6', text: 'Jumlah organisme bertambah sebanyak 3 organisme setiap 60 menit.', isCorrect: false },
              { id: 'd7', text: 'Pengamatan berakhir pada pukul 12.00.', isCorrect: true }
            ],
            ditanyaOptions: [
              { id: 't1', text: 'Berapa jumlah organisme Hydra Cells yang tersisa di ruang utama pada pukul 12.00 setelah pemindahan?', isCorrect: true },
              { id: 't2', text: 'Berapa kali organisme Hydra Cells membelah diri selama pengamatan?', isCorrect: false },
              { id: 't3', text: 'Berapa jumlah organisme Hydra Cells yang dipindahkan ke ruang penyimpanan setiap 60 menit?', isCorrect: false }
            ],
            feedbackCorrect: 'Semua informasi penting telah ditemukan. Informasi tersebut dapat digunakan untuk menentukan jumlah organisme pada setiap tahap.',
            feedbackWrong: 'Terdapat informasi yang kurang tepat. Periksa kembali narasi dan jawabanmu!'
          },

          // ----------------------------------------------------
          // HALAMAN 3: Membimbing Penyelidikan
          // ----------------------------------------------------
          {
            stageNum: 3,
            phaseTitle: 'Membimbing Penyelidikan',
            robotPromptPart1: 'Sebelum menghitung jumlah organisme Hydra Cells, kita harus tahu dulu berapa kali pembelahan terjadi. Menurutmu, apa yang perlu ditentukan terlebih dahulu?',
            optionsPart1: [
              { key: 'A', text: 'Menghitung jumlah organisme yang tersisa setelah setengah dari seluruh organisme dipindahkan ke ruang penyimpanan.' },
              { key: 'B', text: 'Menentukan banyaknya selang waktu pembelahan dari pukul 08.00 hingga pukul 12.00.' },
              { key: 'C', text: 'Menghitung jumlah organisme setelah setiap pembelahan hingga pukul 12.00.' },
              { key: 'D', text: 'Menentukan model matematika untuk menghitung jumlah organisme setelah pembelahan selama pengamatan.' }
            ],
            correctKeyPart1: 'B',
            feedbackCorrectPart1: 'Bagus! Sekarang gunakan Time Scanner untuk menghitung banyaknya selang waktu pembelahan selama pengamatan!',
            feedbackWrongPart1: 'Sayang sekali jawaban kamu kurang tepat. Coba pikirkan sekali lagi!',

            robotPromptPart2: 'Tentukan banyaknya selang waktu pembelahan dari pukul 08.00 hingga pukul 12.00!',
            correctAnswersPart2: ['4 jam', '240 menit', '4', '240'],
            feedbackCorrectPart2: 'Jawaban kamu benar Explorer!',
            feedbackWrongPart2: 'Belum tepat, Explorer! Pembelahannya terjadi dari pukul 08.00 hingga 12.00, sehingga kamu bisa menghitung jarak dari pukul 08.00 hingga 12.00 itu selama berapa jam?'
          },

          // ----------------------------------------------------
          // HALAMAN 4: Menentukan Model Matematika
          // ----------------------------------------------------
          {
            stageNum: 4,
            instruction: 'Perhatikan gambar berikut!',
            knownInfo: [
              'a) Jumlah awal organisme Hydra Cells adalah 2 organisme',
              'b) Jumlah organisme bertambah menjadi 3 kali lipat setiap 60 menit.',
              'c) Pembelahan berlangsung selama 4 jam, sehingga terjadi 4 siklus pembelahan.'
            ],
            riddle: 'Berdasarkan informasi dan ilustrasi tersebut, pilihlah bentuk matematika yang tepat untuk menentukan banyak organisme Hydra Cells setelah melakukan pembelahan selama 4 jam?',
            options: [
              { key: 'A', text: '2 + 3 × 4' },
              { key: 'B', text: '2 × 3⁴' },
              { key: 'C', text: '2⁴ × 3' },
              { key: 'D', text: '2 × 4³' }
            ],
            correctKey: 'B',
            feedbackCorrect: 'Bentuk matematika berhasil ditentukan! 🧩 Jumlah awal adalah 2 organisme, dan jumlahnya menjadi tiga kali lipat sebanyak 4 siklus (jam).',
            feedbackWrong: 'Perhatikan kembali jumlah awal dan pola perubahan organisme pada setiap jam. Pilih model yang menggambarkan pertumbuhan tersebut.'
          },

          // ----------------------------------------------------
          // HALAMAN 5: Menghitung Jumlah Organisme Setelah Pembelahan
          // ----------------------------------------------------
          {
            stageNum: 5,
            robotPrompt: 'Sekarang, hitunglah nilai berikut dan tuliskan hasilnya!\n2 × 3⁴ = ... organisme',
            correctAnswer: '162',
            feedbackCorrect: 'Bagus! 🎉 Setelah pembelahan terakhir, terdapat 162 organisme sebelum pemindahan. Namun, apakah semuanya masih berada di ruang utama?',
            feedbackWrong: 'Jawabanmu kurang tepat. Periksa kembali perhitunganmu.'
          },

          // ----------------------------------------------------
          // HALAMAN 6: Menghitung Organisme yang Tersisa
          // ----------------------------------------------------
          {
            stageNum: 6,
            robotPromptPart1: 'Setelah proses pembelahan selesai, setengah dari seluruh organisme dipindahkan ke ruang penyimpanan. Apa yang perlu kamu lakukan untuk mengetahui jumlah organisme yang masih berada di ruang utama?',
            instructionPart2: 'Oke, sekarang tentukan berapa organisme Hydra Cells yang tersisa di ruang utama setelah pemindahan?',
            correctDenominator: '2',
            correctResult: '81',
            feedbackCorrect: 'Kerja bagus, Explorer! 🏆 Kamu berhasil menyelesaikan tantangan di Eco Dome.',
            feedbackWrong: 'Jawabanmu kurang tepat. Periksa kembali perhitunganmu.'
          },

          // ----------------------------------------------------
          // HALAMAN 7: Menyajikan Hasil (Kesimpulan Akhir)
          // ----------------------------------------------------
          {
            stageNum: 7,
            phaseTitle: 'Menyajikan Hasil',
            robotPrompt: 'Sekarang, bantu aku menuliskan laporan misi agar proses penyelesaian kita dapat diperiksa kembali. Tuliskan kesimpulan akhir dari misi District Eco Dome yang sudah kamu selesaikan',
            initialPrefix: 'Jadi '
          }
        ],

        // ----------------------------------------------------
        // HALAMAN 8: Rekaman Jawaban Siswa (Menganalisis & Mengevaluasi)
        // ----------------------------------------------------
        reviewEvaluation: {
          phaseTitle: 'Menganalisis dan Mengevaluasi Proses Pemecahan Masalah',
          robotPrompt: 'Mari kita periksa kembali proses pemecahan masalah kamu!',
          closingText: 'Karena semua misi di District Eco Dome sudah kamu selesaikan, kamu bisa pindah ke District selanjutnya.',
          items: [
            {
              num: 1,
              title: '1. Orientasi Masalah',
              question: 'Berapa jumlah organisme yang tersisa di ruang utama Eco Dome setelah setengah dari seluruh organisme dipindahkan ke ruang penyimpanan?',
              feedbackCorrect: 'Hebat, Explorer! Kamu sudah memahami tujuan utama misi, yaitu menentukan jumlah organisme yang masih berada di ruang utama setelah setengahnya dipindahkan ke ruang penyimpanan. 🌱',
              feedbackWrong: 'Tidak apa-apa, Explorer! Yuk, pahami kembali tujuan misi ini. Kamu perlu menentukan jumlah organisme yang masih berada di ruang utama setelah setengah dari seluruh organisme dipindahkan ke ruang penyimpanan. Jadi, masalah utamanya bisa kamu lihat dari apa yang ditanyakan.'
            },
            {
              num: 2,
              title: '2. Mengidentifikasi Informasi yang Diketahui',
              question: 'Informasi apa saja yang diketahui dari permasalahan Eco Dome?',
              feedbackCorrect: 'Hebat, Explorer! Kamu sudah menemukan informasi penting dalam soal, yaitu:\n● Jumlah awal organisme adalah 2.\n● Organisme menjadi tiga kali lipat setiap 60 menit.\n● Pengamatan berlangsung dari pukul 08.00 hingga pukul 12.00.',
              feedbackWrong: 'Yuk, periksa kembali informasi dalam soal, Explorer! Informasi yang diketahui meliputi:\n● Jumlah awal organisme adalah 2.\n● Organisme menjadi tiga kali lipat setiap 60 menit.\n● Pengamatan berlangsung dari pukul 08.00 hingga pukul 12.00.\nPastikan semua informasi penting sudah kamu catat!'
            },
            {
              num: 3,
              title: '3. Menentukan Hal yang Ditanyakan',
              question: 'Apa yang perlu ditentukan untuk menyelesaikan misi Eco Dome?',
              feedbackCorrect: 'Bagus, Explorer! Tujuan akhir misi adalah menentukan jumlah organisme yang tersisa di ruang utama setelah pembelahan dan pemindahan organisme.',
              feedbackWrong: 'Explorer, perhatikan kembali tujuan akhir misi! Kamu perlu menentukan jumlah organisme yang masih berada di ruang utama setelah pembelahan selesai dan setengah dari seluruh organisme dipindahkan ke ruang penyimpanan.'
            },
            {
              num: 4,
              title: '4. Menentukan Banyaknya Siklus Pembelahan',
              question: 'Berapa kali pembelahan terjadi dari pukul 08.00 hingga pukul 12.00 jika pembelahan berlangsung setiap 60 menit?',
              feedbackCorrect: 'Tepat sekali, Explorer! Waktu pengamatan berlangsung selama 4 jam atau 240 menit.',
              feedbackWrong: 'Yuk, hitung kembali bersama, Explorer!\n● Pembelahan terjadi setiap 60 menit, dan kita bisa mengubah bentuk menit ke jam, yakni 60 menit = 1 jam.\n● Waktu pengamatan adalah dari pukul 08.00 hingga 12.00, sehingga siklus pembelahannya adalah sebagai berikut: 12.00 − 08.00 = 4 jam .\nIngat, samakan satuan waktunya terlebih dahulu, kemudian hitung banyak siklus pembelahan.'
            },
            {
              num: 5,
              title: '5. Menentukan Model Matematika',
              question: 'Berdasarkan ilustrasi di atas, pilihlah bentuk matematika yang tepat untuk menentukan banyak organisme Hydra Cells setelah melakukan pembelahan selama 4 jam?',
              feedbackCorrect: 'Hebat, Explorer! Model matematika yang tepat adalah 2 × 3ᵗ, di mana t menyatakan lamanya pembelahan. Karena pembelahan berlangsung selama 4 jam, maka dapat ditulis menjadi:\n2 × 3⁴\n\nKeterangan:\n● Angka 2 menyatakan jumlah awal organisme\n● Angka 3 merupakan faktor pengali\n● Pangkat 4 menunjukkan lamanya pembelahan atau siklus pembelahan.',
              feedbackWrong: 'Explorer, yuk, periksa kembali hubungan antara informasi dalam soal dan model matematika!\n● Jumlah awal organisme: 2.\n● Faktor pengali: 3.\n● Banyaknya interval pembelahan: 4.\n\nModel matematika yang tepat adalah 2 × 3ᵗ, di mana t menyatakan lamanya pembelahan. Karena pembelahan berlangsung selama 4 jam, maka dapat ditulis menjadi:\n2 × 3⁴\n\nKeterangan:\n● Angka 2 menyatakan jumlah awal organisme\n● Angka 3 merupakan faktor pengali\n● Pangkat 4 menunjukkan lamanya pembelahan atau siklus pembelahan.'
            },
            {
              num: 6,
              title: '6. Menghitung Jumlah Organisme Setelah Pembelahan',
              question: 'Berapa jumlah organisme setelah seluruh pembelahan selesai?',
              feedbackCorrect: 'Tepat sekali, Explorer! Jumlah organisme setelah pembelahan adalah 162 organisme. Perhitungannya:\n2 × 3⁴ = 2 × 81 = 162',
              feedbackWrong: 'Tidak apa-apa, Explorer! Yuk, periksa kembali langkah perhitungannya.\n2 × 3⁴ = 2 × 81 = 162\nJadi, jumlah organisme setelah seluruh pembelahan selesai adalah 162 organisme.'
            },
            {
              num: 7,
              title: '7. Menghitung Jumlah Organisme yang Tersisa',
              question: 'Setelah pembelahan terakhir, setengah dari seluruh organisme dipindahkan ke ruang penyimpanan. Berapa organisme yang masih berada di ruang utama?',
              feedbackCorrect: 'Hebat, Explorer! Kamu sudah memperhitungkan pemindahan organisme dengan tepat. Dari 162 organisme, setengahnya dipindahkan ke ruang penyimpanan sehingga tersisa 81 organisme di ruang utama.',
              feedbackWrong: 'Explorer, jumlah organisme setelah pembelahan memang 162. Namun, ingat bahwa setengahnya dipindahkan ke ruang penyimpanan!\n\nJumlah yang tersisa di ruang utama adalah:\n162 / 2 = 81\nJadi, jumlah organisme yang tersisa di ruang utama adalah 81 organisme. 🌱'
            }
          ]
        }
      },

      // ----------------------------------------------------
      // DISTRICT 2: Expo Central Control Lab
      // ----------------------------------------------------
      {
        level: 2,
        id: 'escape-district-2',
        title: 'District 2: Expo Central Control Lab',
        sector: 'DISTRICT 02 // EXPO CENTRAL CONTROL LAB',
        rewardXp: 150,
        badgeName: 'Arsitek Jaringan Siber',
        stagesCount: 9, // 9 Halaman pengerjaan + Halaman 10 (Rekaman)
        stages: [
          // ----------------------------------------------------
          // HALAMAN 1: Orientasi Siswa pada Masalah
          // ----------------------------------------------------
          {
            stageNum: 1,
            phaseTitle: 'Orientasi Siswa pada Masalah',
            robotGreeting: 'Hai, Explorer! Ada gangguan keamanan di Expo Central Control Lab! Sistem keamanan mendeteksi sebuah program otomatis yang tidak dikenal sedang mencoba berbagai kombinasi kode akses untuk menembus sistem pusat kendali Expo City.',
            storyText: 'Program tersebut mampu mencoba 1.250 kombinasi kode akses setiap 10 menit. Sistem keamanan mendeteksi hal tersebut dan otomatis mengaktifkan protokol penanganan yang dapat menghentikan peningkatan kecepatan program peretas, serta mengurangi kecepatan percobaan program peretas sebesar 20% dari kecepatan yang tersisa setiap 10 menit. Protokol ini mampu bekerja selama 40 menit.\n\nUntuk menjaga kestabilan sistem, kecepatan program harus turun hingga maksimal 600 kombinasi kode akses setiap 10 menit pada akhir waktu penanganan. Jika kecepatan program masih melebihi batas maksimum kecepatan, sistem pusat kendali akan mengalami crash (berhenti beroperasi) sehingga operasional Expo City terganggu.',
            robotPrompt: '“Bantulah sistem keamanan menentukan apakah kecepatan program sudah berada dalam batas aman setelah protokol penanganan bekerja selama 40 menit!”',
            riddle: 'Explorer, kita harus memahami masalah yang sedang dihadapi sistem pusat kendali terlebih dahulu. Coba perhatikan kembali informasi dalam narasi! Apa masalah utama yang harus diselesaikan dalam misi ini?',
            options: [
              { key: 'A', text: 'Menentukan jumlah awal kombinasi kode akses yang dapat dicoba oleh program setiap 10 menit.' },
              { key: 'B', text: 'Menentukan banyaknya waktu yang dibutuhkan program untuk mulai mencoba kombinasi kode akses.' },
              { key: 'C', text: 'Menentukan apakah kecepatan percobaan program sudah berada dalam batas aman setelah protokol penanganan bekerja selama 40 menit.' },
              { key: 'D', text: 'Menentukan persentase pengurangan kecepatan program yang harus diterapkan setiap 10 menit.' }
            ],
            correctKey: 'C',
            feedbackCorrect: 'Bagus, Explorer! Kamu sudah mengenali masalah utama dalam misi ini. Selanjutnya, kita perlu mengidentifikasi informasi yang dapat digunakan untuk mengetahui kecepatan program pada akhir waktu penanganan.',
            feedbackWrong: 'Sayang sekali, jawabanmu kurang tepat. Coba baca kembali narasi misi dan perhatikan kondisi yang harus dipenuhi agar sistem pusat kendali tetap aman.'
          },

          // ----------------------------------------------------
          // HALAMAN 2: Mengorganisasikan Siswa untuk Belajar
          // ----------------------------------------------------
          {
            stageNum: 2,
            phaseTitle: 'Mengorganisasikan Siswa untuk Belajar',
            robotPromptGroup: 'Silakan berkelompok sebanyak 4 orang berdasarkan tempat duduk kalian dan diskusikan permasalahan di Expo Central Control Lab. Jangan lupa saling membantu sesama teman ya!',
            robotPromptCollect: 'Sebelum melakukan perhitungan, kita perlu mengumpulkan petunjuk terlebih dahulu, Explorer! 🔎 Pilih informasi yang diketahui dan hal yang ditanyakan dalam misi ini.',
            recapTitle: 'GANGGUAN SISTEM EXPO CENTRAL CONTROL LAB!',
            recapText: 'Sebuah program otomatis yang tidak dikenal sedang mencoba berbagai kombinasi kode akses untuk menembus sistem pusat kendali Expo City. Program tersebut mampu mencoba 1.250 kombinasi kode akses setiap 10 menit.\n\nSistem keamanan mendeteksi hal tersebut dan otomatis mengaktifkan protokol penanganan yang dapat menghentikan peningkatan kecepatan program peretas, serta mengurangi kecepatan percobaan program peretas sebesar 20% dari kecepatan yang tersisa setiap 10 menit. Protokol ini mampu bekerja selama 40 menit.\n\nUntuk menjaga kestabilan sistem, kecepatan program harus turun hingga maksimal 600 kombinasi kode akses setiap 10 menit pada akhir waktu penanganan. Jika kecepatan program masih melebihi batas maksimum kecepatan, sistem pusat kendali akan mengalami crash (berhenti beroperasi) sehingga operasional Expo City terganggu.\n\n“Bantulah sistem keamanan menentukan apakah kecepatan program sudah berada dalam batas aman setelah protokol penanganan bekerja selama 40 menit!”',
            instruction: 'Explorer yang terhormat! Pilihlah jawaban yang benar untuk bagian “Diketahui” dan “Ditanyakan”! (jawaban lebih dari satu)',
            diketahuiOptions: [
              { id: 'd1', text: 'Program mencoba sebanyak 1.250 kombinasi kode akses setiap 10 menit pada awal pengamatan.', isCorrect: true },
              { id: 'd2', text: 'Kecepatan percobaan program berkurang sebesar 20% dari kecepatan awal pada setiap tahap.', isCorrect: false },
              { id: 'd3', text: 'Kecepatan percobaan program berkurang sebesar 20% dari kecepatan yang tersisa setiap 10 menit.', isCorrect: true },
              { id: 'd4', text: 'Protokol penanganan bekerja selama 40 menit.', isCorrect: true },
              { id: 'd5', text: 'Kecepatan program harus turun hingga maksimal 600 kombinasi kode akses setiap 10 menit pada akhir waktu penanganan.', isCorrect: true },
              { id: 'd6', text: 'Program mengurangi kecepatan percobaannya sebanyak 600 kombinasi kode akses setiap 10 menit.', isCorrect: false },
              { id: 'd7', text: 'Setiap 10 menit, kecepatan percobaan program bertambah sebesar 20%.', isCorrect: false }
            ],
            ditanyaOptions: [
              { id: 't1', text: 'Berapa jumlah awal kombinasi kode akses yang dapat dicoba oleh program?', isCorrect: false },
              { id: 't2', text: 'Apakah kecepatan percobaan program peretas pada akhir waktu penanganan melebihi batas maksimum yang ditetapkan sistem keamanan Expo City?', isCorrect: true },
              { id: 't3', text: 'Berapa lama waktu yang dibutuhkan sistem keamanan untuk mendeteksi program?', isCorrect: false }
            ],
            feedbackCorrect: 'Hebat, Explorer! Kamu sudah menemukan informasi penting yang dibutuhkan. Ingat, pengurangan sebesar 20% dihitung dari kecepatan yang tersisa pada setiap tahap, bukan selalu dari kecepatan awal.\n\nSelanjutnya, mari kita susun strategi untuk menyelesaikan misi ini!',
            feedbackWrong: 'Masih ada informasi yang kurang tepat, Explorer! Perhatikan kembali jumlah awal, persentase pengurangan, lama penanganan, dan batas maksimum kecepatan program. Pastikan kamu membedakan informasi yang diketahui dengan hal yang perlu ditentukan.'
          },

          // ----------------------------------------------------
          // HALAMAN 3: Membimbing Penyelidikan
          // ----------------------------------------------------
          {
            stageNum: 3,
            phaseTitle: 'Membimbing Penyelidikan',
            robotPromptPart1: 'Sebelum menghitung kecepatan akhir program, kita perlu mengetahui berapa kali protokol penanganan mengurangi kecepatan program.\n\nMenurutmu, apa yang perlu dilakukan terlebih dahulu?',
            optionsPart1: [
              { key: 'A', text: 'Mengurangi kecepatan awal program dengan batas maksimum yang ditetapkan.' },
              { key: 'B', text: 'Menentukan banyaknya siklus penanganan selama 40 menit jika pengurangan dilakukan setiap 10 menit.' },
              { key: 'C', text: 'Mengalikan kecepatan awal dengan persentase pengurangan.' },
              { key: 'D', text: 'Menentukan jumlah program otomatis yang menyerang sistem pusat kendali.' }
            ],
            correctKeyPart1: 'B',
            feedbackCorrectPart1: 'Tepat sekali! Kita perlu mengetahui berapa kali pengurangan kecepatan dilakukan selama protokol penanganan berlangsung.\n\nSekarang, gunakan Time Scanner untuk menghitung banyaknya siklus penanganan!',
            feedbackWrongPart1: 'Sayang sekali jawaban kamu kurang tepat. Coba pikirkan sekali lagi!',
            robotPromptPart2: 'Protokol penanganan bekerja selama 40 menit dan mengurangi kecepatan program setiap 10 menit. Berapa kali pengurangan kecepatan dilakukan selama protokol penanganan berlangsung?',
            correctAnswersPart2: ['4', '4 siklus', '4 kali'],
            feedbackCorrectPart2: 'Benar, Explorer! 🎯 Protokol penanganan berlangsung selama 40 menit dengan interval 10 menit, sehingga terdapat 4 kali pengurangan kecepatan.',
            feedbackWrongPart2: 'Jawabanmu belum tepat. Ingat, satu kali pengurangan kecepatan dilakukan setiap 10 menit. Bagilah total waktu penanganan bekerja (40 menit) dengan 10 menit untuk memperoleh banyaknya siklus penanganan.'
          },

          // ----------------------------------------------------
          // HALAMAN 4: Menentukan Persentase Kecepatan yang Tersisa
          // ----------------------------------------------------
          {
            stageNum: 4,
            robotPrompt: 'Kita sudah mengetahui bahwa pengurangan kecepatan dilakukan sebanyak 4 kali. Namun, ada hal penting yang harus kamu pahami. Jika kecepatan program berkurang sebesar 20%, berapa persen kecepatan yang masih tersisa setelah satu kali pengurangan?',
            options: [
              { key: 'A', text: '20%' },
              { key: 'B', text: '40%' },
              { key: 'C', text: '80%' },
              { key: 'D', text: '120%' }
            ],
            correctKey: 'C',
            feedbackCorrect: 'Tepat sekali! Artinya, setelah setiap siklus penanganan, kecepatan program menjadi 80% dari kecepatan pada tahap sebelumnya.\n\nSekarang, mari kita gunakan informasi ini untuk menentukan perubahan kecepatan program pada setiap tahap!',
            feedbackWrong: 'Belum tepat, Explorer! Jika seluruh kecepatan dianggap 100% dan dikurangi 20%, berapa persen yang masih tersisa? Coba hitung kembali!'
          },

          // ----------------------------------------------------
          // HALAMAN 5: Menyederhanakan Persentase Menjadi Pecahan
          // ----------------------------------------------------
          {
            stageNum: 5,
            robotPrompt: 'Sebelum melakukan perhitungan, kita sederhanakan dahulu persentase kecepatan yang tersisa menjadi pecahan agar lebih mudah digunakan.',
            instruction: 'Perhatikan persentase berikut!\n80% = 80 / 100\n\nPilihlah bentuk sederhana dari pecahan di atas!',
            options: [
              { key: 'A', text: '1 / 5' },
              { key: 'B', text: '2 / 5' },
              { key: 'C', text: '3 / 5' },
              { key: 'D', text: '4 / 5' }
            ],
            correctKey: 'D',
            feedbackCorrect: 'Hebat, Explorer! Kamu berhasil menyederhanakan 80% menjadi pecahan (4/5).\n\nArtinya, setiap 10 menit, kecepatan program yang tersisa adalah (4/5) dari kecepatan sebelumnya.',
            feedbackWrong: 'Jawabanmu belum tepat, Explorer! Ingat, bentuk 80% sama dengan pecahan 80/100.\n\nCara menyederhanakan pecahan tersebut adalah membagi pembilang dan penyebutnya dengan 20/20. Coba hitung kembali!'
          },

          // ----------------------------------------------------
          // HALAMAN 6: Menentukan Model Matematika
          // ----------------------------------------------------
          {
            stageNum: 6,
            instruction: 'Perhatikan gambar berikut!',
            knownInfo: [
              'Kecepatan awal program peretas adalah 1.250 kombinasi kode akses setiap 10 menit.',
              'Kecepatan yang tersisa pada setiap pengurangan adalah 4/5 dari kecepatan sebelumnya.',
              'Pengurangan dilakukan sebanyak 4 kali selama 40 menit.'
            ],
            robotPrompt: 'Berdasarkan informasi di atas, bagaimana cara menuliskan bentuk matematika untuk menentukan kecepatan program setelah protokol penanganan bekerja selama 40 menit?',
            riddle: 'Berdasarkan informasi pada soal, pilihlah bentuk matematika yang tepat untuk menentukan kecepatan program setelah protokol penanganan bekerja selama 40 menit!',
            options: [
              { key: 'A', text: '1250 − (4/5) × 4' },
              { key: 'B', text: '1250 × (1/5)⁴' },
              { key: 'C', text: '1250 × (4/5)⁴' },
              { key: 'D', text: '1250 − (1250 × 1/5 × 4)' }
            ],
            correctKey: 'C',
            feedbackCorrect: 'Tepat sekali, Explorer! 🧩 Angka 1.250 menunjukkan kecepatan awal program, (4/5) menunjukkan bagian kecepatan yang tersisa setelah setiap pengurangan, dan pangkat 4 menunjukkan pengurangan dilakukan sebanyak 4 kali.',
            feedbackWrong: 'Jawabanmu belum tepat, Explorer! Perhatikan bahwa setiap pengurangan dihitung berdasarkan kecepatan yang tersisa pada tahap sebelumnya. Karena itu, digunakan (4/5) berulang sebanyak 4 kali.\n\nCoba pilih bentuk matematika yang menunjukkan kecepatan awal program peretas dikalikan dengan pecahan tersebut sebanyak 4 kali!'
          },

          // ----------------------------------------------------
          // HALAMAN 7: Menghitung Kecepatan Akhir Program Peretas
          // ----------------------------------------------------
          {
            stageNum: 7,
            robotPrompt: 'Kamu hebat, Explorer! Sekarang, selesaikan perhitungannya.',
            instruction: 'Hitunglah nilai berikut dan tuliskan hasilnya!\n1250 × (4/5)⁴ = ... kombinasi kode akses setiap 10 menit',
            correctAnswer: '512',
            feedbackCorrect: 'Perhitunganmu benar, Explorer! 🎉 Setelah empat kali pengurangan, kecepatan program peretas menjadi 512 kombinasi kode akses setiap 10 menit.\n\nNamun, apakah kecepatan tersebut sudah memenuhi batas maksimum yang ditetapkan oleh sistem keamanan? Mari kita periksa!',
            feedbackWrong: 'Jawabanmu belum tepat. Coba hitung kembali nilai (4/5)⁴ dengan mengalikan 4/5 sebanyak 4 kali, yakni 4/5 × 4/5 × 4/5 × 4/5. Kemudian, kalikan hasilnya dengan 1.250.'
          },

          // ----------------------------------------------------
          // HALAMAN 8: Membandingkan Kecepatan Akhir dengan Batas Maksimum
          // ----------------------------------------------------
          {
            stageNum: 8,
            robotPrompt: 'Kamu telah mengenali masalah utama. Sekarang, identifikasi informasi yang dapat digunakan untuk menyelesaikannya.\n\nExplorer, kita telah memperoleh kecepatan akhir program peretas sebesar 512 kombinasi kode akses setiap 10 menit. Sementara itu, sistem keamanan menetapkan batas maksimum sebesar 600 kombinasi kode akses setiap 10 menit.\n\nSekarang, isikan kedua nilai tersebut pada ruas pertidaksamaan berikut dengan tepat!',
            correctLeft: '512',
            correctRight: '600',
            feedbackCorrect: 'Tepat sekali, Explorer! Kecepatan akhir program peretas sebesar 512 lebih kecil daripada batas maksimum 600 kombinasi kode akses setiap 10 menit.',
            feedbackWrong: 'Belum tepat, Explorer! Periksa kembali nilai kecepatan akhir program peretas dan batas maksimum sistem keamanan. Mana nilai yang lebih kecil dan mana nilai yang lebih besar.'
          },

          // ----------------------------------------------------
          // HALAMAN 9: Menyajikan Hasil (Drag and Drop & Kesimpulan Akhir)
          // ----------------------------------------------------
          {
            stageNum: 9,
            phaseTitle: 'Menyajikan Hasil',
            robotPromptPart1: 'Hebat, Explorer! Kamu telah menyelesaikan perhitungan kecepatan akhir program peretas. Sekarang, tentukan kondisi akhir sistem pusat kendali berdasarkan hasil penyelidikanmu!',
            instructionDrag: 'Bagus! Kamu telah mengenali masalah utama. Sekarang, identifikasi informasi yang dapat digunakan untuk menyelesaikannya.\n\nDrag and drop satu jawaban yang tepat ke kotak kosong berikut untuk menentukan kondisi akhir sistem pusat kendali Expo City!',
            dragCards: [
              { id: 'A', text: 'Kartu A: Sistem Mengalami Crash' },
              { id: 'B', text: 'Kartu B: Sistem Tidak Mengalami Crash' }
            ],
            correctDragId: 'B',
            feedbackCorrectDrag: 'Bagus, Explorer! Setelah menentukan kondisi akhir sistem, tuliskan kesimpulan akhir misi Expo Central Control Lab secara utuh!',
            feedbackWrongDrag: 'Belum tepat, Explorer! Ingat, sistem akan mengalami crash jika kecepatan akhir program peretas melebihi batas maksimum yang ditetapkan. Periksa kembali hasil perhitungan dan perbandinganmu!',
            initialPrefix: 'Jadi '
          }
        ],

        // ----------------------------------------------------
        // HALAMAN 10: Rekaman Jawaban Siswa (Menganalisis & Mengevaluasi)
        // ----------------------------------------------------
        reviewEvaluation: {
          phaseTitle: 'Menganalisis dan Mengevaluasi Proses Pemecahan Masalah',
          robotPrompt: 'Mari kita periksa kembali proses pemecahan masalah kamu, Explorer! Pastikan setiap langkah yang kamu lakukan sudah tepat agar sistem pusat kendali Expo City tetap aman. 🖥️',
          closingText: 'Selamat! Seluruh misi utama di Expo City telah berhasil kamu selesaikan dengan sempurna. Silakan periksa rekaman jawabanmu atau kembali ke Hub Misi Utama.',
          items: [
            {
              num: 1,
              title: '1. Orientasi Masalah',
              question: 'Apakah sistem pusat kendali Expo City akan mengalami crash jika kecepatan program peretas harus turun hingga maksimal 600 kombinasi kode akses setiap 10 menit setelah protokol penanganan berlangsung selama 40 menit?',
              feedbackCorrect: 'Hebat, Explorer! Kamu sudah memahami tujuan utama misi, yaitu menentukan apakah sistem pusat kendali Expo City akan mengalami crash berdasarkan kecepatan akhir program peretas setelah protokol penanganan berlangsung selama 40 menit.',
              feedbackWrong: 'Tidak apa-apa, Explorer! Yuk, pahami kembali tujuan misi ini. Kamu perlu menentukan apakah kecepatan akhir program peretas sudah memenuhi batas maksimum yang ditetapkan oleh sistem keamanan. Jika kecepatan akhirnya masih melebihi batas tersebut, sistem pusat kendali akan mengalami crash.'
            },
            {
              num: 2,
              title: '2. Mengidentifikasi Informasi yang Diketahui',
              question: 'Informasi apa saja yang diketahui dari permasalahan Expo Central Control Lab?',
              feedbackCorrect: 'Hebat, Explorer! Kamu sudah menemukan informasi penting dalam soal, yaitu:\n● Kecepatan awal program peretas adalah 1.250 kombinasi kode akses setiap 10 menit.\n● Sistem keamanan mengurangi kecepatan program peretas sebesar 20% dari kecepatan yang tersisa setiap 10 menit.\n● Protokol penanganan berlangsung selama 40 menit.\n● Kecepatan maksimum yang diizinkan pada akhir waktu penanganan adalah 600 kombinasi kode akses setiap 10 menit.\n● Sistem pusat kendali akan mengalami crash jika kecepatan akhir program peretas masih melebihi batas maksimum.',
              feedbackWrong: 'Yuk, periksa kembali informasi dalam soal, Explorer! Informasi yang diketahui meliputi:\n● Kecepatan awal program peretas adalah 1.250 kombinasi kode akses setiap 10 menit.\n● Kecepatan program berkurang sebesar 20% dari kecepatan yang tersisa setiap 10 menit.\n● Lama waktu penanganan adalah 40 menit.\n● Batas maksimum kecepatan program pada akhir penanganan adalah 600 kombinasi kode akses setiap 10 menit.\n● Sistem mengalami crash jika kecepatan akhir program melebihi batas maksimum.\nPastikan semua informasi penting sudah kamu catat!'
            },
            {
              num: 3,
              title: '3. Menentukan Hal yang Ditanyakan',
              question: 'Apa yang perlu ditentukan untuk menyelesaikan misi Expo Central Control Lab?',
              feedbackCorrect: 'Bagus, Explorer! Tujuan akhir misi adalah menentukan kecepatan program peretas setelah protokol penanganan berlangsung selama 40 menit, kemudian membandingkannya dengan batas maksimum untuk mengetahui apakah sistem pusat kendali mengalami crash.',
              feedbackWrong: 'Explorer, perhatikan kembali tujuan akhir misi! Kamu perlu menghitung kecepatan akhir program peretas setelah mengalami pengurangan selama 40 menit. Setelah itu, bandingkan hasilnya dengan batas maksimum sebesar 600 kombinasi kode akses setiap 10 menit untuk menentukan kondisi akhir sistem.'
            },
            {
              num: 4,
              title: '4. Menentukan Banyaknya Siklus Pengurangan Kecepatan',
              question: 'Berapa kali pengurangan kecepatan terjadi selama protokol penanganan berlangsung selama 40 menit jika pengurangan dilakukan setiap 10 menit?',
              feedbackCorrect: 'Tepat sekali, Explorer! Protokol penanganan berlangsung selama 40 menit dan pengurangan kecepatan dilakukan setiap 10 menit. Oleh karena itu, banyaknya siklus pengurangan dapat ditentukan dengan perhitungan berikut:\n\nSiklus = 40 / 10 = 4\n\nJadi, pengurangan kecepatan terjadi sebanyak 4 kali.',
              feedbackWrong: 'Yuk, hitung kembali bersama, Explorer!\n\nProtokol penanganan berlangsung selama 40 menit, sedangkan setiap pengurangan dilakukan setelah 10 menit. Banyaknya siklus pengurangan dapat dihitung dengan membagi total waktu penanganan dengan interval pengurangan:\n\nSiklus = 40 / 10 = 4\n\nJadi, terdapat 4 siklus pengurangan kecepatan selama protokol penanganan berlangsung.'
            },
            {
              num: 5,
              title: '5. Menentukan Persentase Kecepatan yang Tersisa',
              question: 'Jika kecepatan program peretas dikurangi sebesar 20% dari kecepatan yang tersisa setiap 10 menit, berapa persentase kecepatan yang masih tersisa setelah setiap pengurangan?',
              feedbackCorrect: 'Hebat, Explorer! Jika kecepatan program dikurangi sebesar 20%, persentase kecepatan yang tersisa adalah:\n\n100% − 20% = 80%\n\nJadi, setiap 10 menit, kecepatan program peretas menjadi 80% dari kecepatan sebelum pengurangan.',
              feedbackWrong: 'Explorer, ingat bahwa kecepatan program dikurangi sebesar 20% dari kecepatan yang tersisa. Artinya, kita perlu menentukan persentase yang masih tersisa setelah pengurangan.\n\n100% − 20% = 80%\n\nJadi, kecepatan program peretas yang tersisa adalah 80% dari kecepatan sebelumnya.'
            },
            {
              num: 6,
              title: '6. Mengubah Persentase Menjadi Bentuk Pecahan',
              question: 'Bagaimana cara mengubah 80% menjadi bentuk pecahan yang dapat digunakan untuk menyusun model matematika?',
              feedbackCorrect: 'Tepat sekali, Explorer! Persentase 80% dapat diubah menjadi pecahan sebagai berikut:\n\n80% = 80 / 100 = 4 / 5',
              feedbackWrong: 'Yuk, periksa kembali cara mengubah persentase menjadi pecahan, Explorer!\n\nPersentase 80% berarti 80 dari 100, sehingga:\n80% = 80 / 100 = 4 / 5\n\nJadi, bentuk pecahan paling sederhana dari 80% adalah 4/5. Pecahan ini digunakan karena kecepatan program peretas berkurang menjadi 4/5 dari kecepatan sebelumnya setiap 10 menit.'
            },
            {
              num: 7,
              title: '7. Menentukan Model Matematika',
              question: 'Berdasarkan informasi yang diketahui, bentuk matematika apa yang tepat untuk menentukan kecepatan program peretas setelah mengalami pengurangan selama 40 menit?',
              feedbackCorrect: 'Hebat, Explorer! Bentuk matematika yang tepat adalah:\n\n1250 × (4/5)⁴\n\nKeterangan:\n● Angka 1250 menyatakan kecepatan awal program peretas, yaitu 1.250 kombinasi kode akses setiap 10 menit.\n● 4/5 menyatakan bagian kecepatan yang tersisa setelah setiap pengurangan.\n● Pangkat 4 menunjukkan banyaknya siklus pengurangan selama 40 menit.',
              feedbackWrong: 'Explorer, yuk, periksa kembali hubungan antara informasi dalam soal dan bentuk matematika!\n\n1250 × (4/5)⁴\n\nKeterangan:\n● Angka 1250 menyatakan kecepatan awal program peretas, yaitu 1.250 kombinasi kode akses setiap 10 menit.\n● 4/5 menyatakan bagian kecepatan yang tersisa setelah setiap pengurangan.\n● Pangkat 4 menunjukkan banyaknya siklus pengurangan selama 40 menit.'
            },
            {
              num: 8,
              title: '8. Menghitung Kecepatan Akhir Program Peretas',
              question: 'Berapa kecepatan program peretas setelah protokol penanganan berlangsung selama 40 menit?',
              feedbackCorrect: 'Tepat sekali! Kecepatan akhir program peretas adalah 512 kombinasi kode akses setiap 10 menit.\n\nPerhitungannya:\n1250 × (4/5)⁴ = 1250 × 256 / 625 = 512',
              feedbackWrong: 'Tidak apa-apa, Explorer! Yuk, periksa kembali perhitungannya!\n\n1250 × (4/5)⁴ = 1250 × 4/5 × 4/5 × 4/5 × 4/5\n= 1250 × 256 / 625\n= 512\n\nJadi, kecepatan akhir program peretas adalah 512 kombinasi kode akses setiap 10 menit.'
            },
            {
              num: 9,
              title: '9. Membandingkan Kecepatan Akhir dengan Batas Maksimum',
              question: 'Bagaimana hubungan antara kecepatan akhir program peretas dan batas maksimum yang ditetapkan sistem keamanan?',
              feedbackCorrect: 'Tepat sekali Explorer! Hubungan keduanya dapat dituliskan sebagai berikut:\n\n512 < 600\n\nJadi, kecepatan akhir program peretas setelah penanganan lebih kecil daripada batas maksimum kecepatan yang ditetapkan sistem keamanan.',
              feedbackWrong: 'Explorer, yuk periksa kembali! Hubungan keduanya dapat dituliskan sebagai berikut:\n\n512 < 600\n\nJadi, kecepatan akhir program peretas setelah penanganan lebih kecil daripada batas maksimum kecepatan yang ditetapkan sistem keamanan.'
            },
            {
              num: 10,
              title: '10. Menentukan kesimpulan Misi',
              question: 'Berdasarkan hasil perhitungan dan perbandingan yang telah dilakukan, apakah sistem pusat kendali Expo City mengalami crash?',
              feedbackCorrect: 'Hebat, Explorer! Karena kecepatan akhir program peretas (512 kombinasi kode akses tiap 10 menit) tidak melebihi batas maksimum kecepatan yang ditetapkan sistem keamanan (600 kombinasi kode akses tiap 10 menit), maka sistem pusat kendali Expo City tidak mengalami crash.',
              feedbackWrong: 'Karena kecepatan akhir program peretas (512 kombinasi kode akses tiap 10 menit) tidak melebihi batas maksimum kecepatan yang ditetapkan sistem keamanan (600 kombinasi kode akses tiap 10 menit), maka sistem pusat kendali Expo City tidak mengalami crash.'
            }
          ]
        }
      }
    ];

    this.levels = this.districts;
    this.activeLevelNum = 1;
    this.syncActiveLevelFromUser();
  }

  syncActiveLevelFromUser() {
    if (typeof userModel === 'undefined') return;
    const user = userModel.getUser();
    if (user) {
      const unlocked = user.unlockedMissionLevels || [1];
      const completed = user.completedMissionLevels || [];
      let nextUnfinished = [1, 2].find(lvl => unlocked.includes(lvl) && !completed.includes(lvl));
      if (!nextUnfinished) {
        nextUnfinished = Math.max(...unlocked, 1);
      }
      this.activeLevelNum = nextUnfinished;
    }
  }

  getLevel(levelNum) {
    const num = parseInt(levelNum, 10) || 1;
    return this.districts.find(d => d.level === num) || this.districts[0];
  }

  getDistrict(levelNum) {
    return this.getLevel(levelNum);
  }

  completeDistrict(levelNum, answersMap) {
    const district = this.getLevel(levelNum);
    if (!district) return;
    userModel.solveMissionLevel(levelNum, {
      answersMap: answersMap,
      isCorrect: true,
      completedAt: new Date().toISOString()
    }, district.rewardXp || 150);
  }
}

const missionModel = new MissionModel();
