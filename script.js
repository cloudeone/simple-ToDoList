
// 1. Membuat Array kosong
let toDoArray = [];

// ID untuk setiap tugas
let nextId = 1;

// 2. Mengambil elemen HTML
let inputTugas = document.getElementById("inputTugas");
let btnTambah = document.getElementById("btnTambah");
let areaArray = document.getElementById("areaArray");

// Fungsi untuk menampilkan Array ke Console
function tampilkanConsole() {
    console.clear();

    console.log("===== DATA TO-DO LIST =====");
    console.table(toDoArray);
    console.log("Total tugas:", toDoArray.length);
}

// 3. Fungsi untuk menampilkan daftar tugas
function tampilkanTugas() {

    // Jika Array kosong
    if (toDoArray.length == 0) {
        areaArray.innerHTML =
            "<p class='empty-text'>Belum ada tugas.</p>";
        return;
    }

    let hasil = "<ul class='list-group'>";

    // Perulangan untuk menampilkan tugas
    for (let i = 0; i < toDoArray.length; i++) {

        let tugas = toDoArray[i];

        hasil += `
            <li class="list-group-item d-flex align-items-center gap-2">

                <input
                    type="checkbox"
                    class="form-check-input"
                    data-id="${tugas.id}"
                    ${tugas.selesai ? "checked" : ""}
                >

                <span class="task-text ${tugas.selesai ? "task-done" : ""}">
                    ${escapeHTML(tugas.nama)}
                </span>

                <button
                    class="btn btn-sm btn-edit"
                    data-action="edit"
                    data-id="${tugas.id}"
                    title="Edit tugas"
                >
                    ✏️
                </button>

                <button
                    class="btn btn-sm btn-delete"
                    data-action="hapus"
                    data-id="${tugas.id}"
                    title="Hapus tugas"
                >
                    🗑️
                </button>

            </li>
        `;
    }

    hasil += "</ul>";

    areaArray.innerHTML = hasil;
}

// Mengamankan teks input agar tidak dianggap sebagai HTML
function escapeHTML(teks) {
    return teks.replace(/[&<>"']/g, function(karakter) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[karakter];
    });
}

// 4. Fungsi tambah tugas
function tambahTugas() {

    let tugasBaru = inputTugas.value.trim();

    // Validasi input
    if (tugasBaru == "") {
        alert("tugas tidak boleh kosong");
        console.warn("Gagal menambahkan tugas: input kosong");
        return;
    }

    // Menambahkan tugas ke Array
    toDoArray.push({
        id: nextId++,
        nama: tugasBaru,
        selesai: false
    });

    console.log("Tugas berhasil ditambahkan:", tugasBaru);

    // Mengosongkan input
    inputTugas.value = "";

    // Menampilkan ulang daftar
    tampilkanTugas();
    tampilkanConsole();
}

// 5. Tombol tambah
btnTambah.onclick = tambahTugas;

// Bisa menambahkan tugas dengan tombol Enter
inputTugas.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        tambahTugas();
    }
});

// 6. Fitur checklist
areaArray.addEventListener("change", function(event) {

    if (event.target.type == "checkbox") {

        let id = Number(event.target.dataset.id);

        let tugas = toDoArray.find(function(item) {
            return item.id == id;
        });

        if (tugas) {
            tugas.selesai = event.target.checked;

            console.log(
                "Status tugas diperbarui:",
                tugas.nama,
                tugas.selesai ? "SELESAI" : "BELUM SELESAI"
            );

            tampilkanTugas();
            tampilkanConsole();
        }
    }
});

// 7. Fitur edit dan hapus
areaArray.addEventListener("click", function(event) {

    let tombol = event.target.closest("button");

    if (!tombol) {
        return;
    }

    let id = Number(tombol.dataset.id);

    // Mencari posisi tugas dalam Array
    let index = toDoArray.findIndex(function(item) {
        return item.id == id;
    });

    if (index == -1) {
        return;
    }

    // Fitur edit
    if (tombol.dataset.action == "edit") {

        let namaBaru = prompt(
            "Masukkan nama tugas baru:",
            toDoArray[index].nama
        );

        if (namaBaru === null) {
            console.log("Edit tugas dibatalkan.");
            return;
        }

        namaBaru = namaBaru.trim();

        if (namaBaru == "") {
            alert("Nama tugas tidak boleh kosong!");
            return;
        }

        let namaLama = toDoArray[index].nama;

        toDoArray[index].nama = namaBaru;

        console.log("Tugas berhasil diedit:", {
            sebelumnya: namaLama,
            sekarang: namaBaru
        });
    }

    // Fitur hapus
    else if (tombol.dataset.action == "hapus") {

        let konfirmasi = confirm("Yakin ingin menghapus tugas ini?");

        if (konfirmasi) {

            let tugasDihapus = toDoArray[index];

            // Menghapus data menggunakan splice
            toDoArray.splice(index, 1);

            console.log("Tugas berhasil dihapus:", tugasDihapus.nama);
        }
    }

    // Menampilkan ulang daftar
    tampilkanTugas();
    tampilkanConsole();
});

// Menampilkan data awal di Console
tampilkanTugas();
tampilkanConsole();
