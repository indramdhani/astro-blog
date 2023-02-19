---
title: "convert cr2 ke jpg png"
publishDate: "2016-02-06"
description: use the snippet on this post to convert cr2 to another format
tags:
  - "code-series"
  - "cr2"
---

Halo,

Akhirnya ada bahan untuk isi-isi tulisan lagi disini. Kali ini mau bahas hal yang sedikit teknis hehehe. Sebagai orang yang suka memakai kamera kadang format raw/cr2 dipakai, alasannya supaya lebih fleksibel. Nah format file ini engga bisa langsung dipakai kalau mau share-share foto ke sosial media atau upload-upload ke website (filenya bakal terlalu besar). Makanya filenya perlu di convert ke format lain, bisa jpeg atau png.

Hal-hal yang berkaitan dengan convert ini simpel kalo kita pake windows atau mac (mungkin, soalnya belum pernah pakai mac). Biasanya ada aplikasi bawaan dari kamera yang bisa dipakai di dua OS itu. Bisa juga menggunakan aplikasi lain semisal Adobe Photoshop, Adobe Lightroom atau aplikasi lain.

Nah kalau di Ubuntu/Linux (FYI, sekarang saya pakai Ubuntu untuk personal notebook saya), ini agak ribet. Jarang ada aplikasi bawaan kamera yang support Ubuntu/Linux. Bisa si install Photoshop dengan bantuan Wine atau install windows terlebih dulu pake virtual box atau vmware. Kendalanya, metode itu bakal makan banyak resources dan performanya engga begitu bagus.

Sampai akhirnya kemarin nemu cara lain (kalau hanya untuk konversi format dan tidak butuh editing lain2) dengan menggunakan ufraw. Cukup dengan satu baris perintah di terminal kita bisa melakukan konversi format gambar. Jangan lupa install dulu aplikasinya.

```
sudo apt-get install ufraw-batch
```

kemudian, buka terminal atau arahkan terminal ke direktori yang berisi file-file yang akan dikonversi. ketikan perintah ini kemudian tekan enter

```
ufraw-batch --out-type png \*.CR2
```

itu png bisa diganti dengan format lain yang diinginkan.

Simple ya, hehehe :).

source : [http://askubuntu.com/questions/483379/how-to-convert-cr2-to-jpg-or-png](http://askubuntu.com/questions/483379/how-to-convert-cr2-to-jpg-or-png)
