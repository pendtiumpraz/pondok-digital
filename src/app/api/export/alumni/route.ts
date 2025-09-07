import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const institutionType = searchParams.get('institutionType');
    const graduationYear = searchParams.get('graduationYear');
    const availableForEvents = searchParams.get('availableForEvents');
    const format = searchParams.get('format') || 'json';

    // Build where clause
    const where: any = {};
    
    if (institutionType && institutionType !== 'all') {
      where.institutionType = institutionType;
    }
    
    if (graduationYear && graduationYear !== 'all') {
      where.graduationYear = graduationYear;
    }
    
    if (availableForEvents && availableForEvents !== 'all') {
      where.availableForEvents = availableForEvents === 'true';
    }

    // Fetch alumni data
    const alumni = await prisma.alumni.findMany({
      where,
      select: {
        id: true,
        nisn: true,
        nis: true,
        fullName: true,
        nickname: true,
        birthPlace: true,
        birthDate: true,
        gender: true,
        bloodType: true,
        religion: true,
        nationality: true,
        currentAddress: true,
        currentCity: true,
        currentProvince: true,
        currentCountry: true,
        phone: true,
        whatsapp: true,
        email: true,
        facebook: true,
        instagram: true,
        linkedin: true,
        fatherName: true,
        motherName: true,
        institutionType: true,
        graduationYear: true,
        generation: true,
        currentJob: true,
        jobPosition: true,
        company: true,
        furtherEducation: true,
        university: true,
        major: true,
        maritalStatus: true,
        spouseName: true,
        childrenCount: true,
        memories: true,
        message: true,
        availableForEvents: true,
        lastContactDate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { institutionType: 'asc' },
        { graduationYear: 'desc' },
        { fullName: 'asc' }
      ]
    });

    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data: alumni,
        total: alumni.length
      });
    }

    // For export formats, return processed data
    const exportData = alumni.map(alum => ({
      'NISN': alum.nisn || '',
      'NIS': alum.nis || '',
      'Nama Lengkap': alum.fullName,
      'Nama Panggilan': alum.nickname || '',
      'Tempat Lahir': alum.birthPlace,
      'Tanggal Lahir': alum.birthDate.toISOString().split('T')[0],
      'Jenis Kelamin': alum.gender === 'MALE' ? 'Laki-laki' : 'Perempuan',
      'Golongan Darah': alum.bloodType || '',
      'Agama': alum.religion,
      'Kewarganegaraan': alum.nationality,
      'Alamat Sekarang': alum.currentAddress,
      'Kota Sekarang': alum.currentCity,
      'Provinsi Sekarang': alum.currentProvince || '',
      'Negara Sekarang': alum.currentCountry,
      'Telepon': alum.phone || '',
      'WhatsApp': alum.whatsapp || '',
      'Email': alum.email || '',
      'Facebook': alum.facebook || '',
      'Instagram': alum.instagram || '',
      'LinkedIn': alum.linkedin || '',
      'Nama Ayah': alum.fatherName || '',
      'Nama Ibu': alum.motherName || '',
      'Jenis Institusi': alum.institutionType,
      'Tahun Lulus': alum.graduationYear,
      'Angkatan': alum.generation || '',
      'Pekerjaan Sekarang': alum.currentJob || '',
      'Jabatan': alum.jobPosition || '',
      'Perusahaan': alum.company || '',
      'Pendidikan Lanjutan': alum.furtherEducation || '',
      'Universitas': alum.university || '',
      'Jurusan': alum.major || '',
      'Status Pernikahan': alum.maritalStatus || '',
      'Nama Pasangan': alum.spouseName || '',
      'Jumlah Anak': alum.childrenCount.toString(),
      'Kenangan': alum.memories || '',
      'Pesan untuk Juniors': alum.message || '',
      'Bersedia Diundang Acara': alum.availableForEvents ? 'Ya' : 'Tidak',
      'Terakhir Dihubungi': alum.lastContactDate ? alum.lastContactDate.toISOString().split('T')[0] : '',
      'Tanggal Dibuat': alum.createdAt.toISOString().split('T')[0]
    }));

    return NextResponse.json({
      success: true,
      data: exportData,
      total: exportData.length,
      columns: [
        { key: 'NISN', header: 'NISN', width: 15 },
        { key: 'NIS', header: 'NIS', width: 15 },
        { key: 'Nama Lengkap', header: 'Nama Lengkap', width: 25 },
        { key: 'Nama Panggilan', header: 'Nama Panggilan', width: 15 },
        { key: 'Tempat Lahir', header: 'Tempat Lahir', width: 15 },
        { key: 'Tanggal Lahir', header: 'Tanggal Lahir', width: 15, type: 'date' },
        { key: 'Jenis Kelamin', header: 'Jenis Kelamin', width: 15 },
        { key: 'Golongan Darah', header: 'Golongan Darah', width: 10 },
        { key: 'Agama', header: 'Agama', width: 10 },
        { key: 'Kewarganegaraan', header: 'Kewarganegaraan', width: 15 },
        { key: 'Alamat Sekarang', header: 'Alamat Sekarang', width: 30 },
        { key: 'Kota Sekarang', header: 'Kota Sekarang', width: 15 },
        { key: 'Provinsi Sekarang', header: 'Provinsi Sekarang', width: 15 },
        { key: 'Negara Sekarang', header: 'Negara Sekarang', width: 15 },
        { key: 'Telepon', header: 'Telepon', width: 15 },
        { key: 'WhatsApp', header: 'WhatsApp', width: 15 },
        { key: 'Email', header: 'Email', width: 25 },
        { key: 'Facebook', header: 'Facebook', width: 20 },
        { key: 'Instagram', header: 'Instagram', width: 15 },
        { key: 'LinkedIn', header: 'LinkedIn', width: 20 },
        { key: 'Nama Ayah', header: 'Nama Ayah', width: 20 },
        { key: 'Nama Ibu', header: 'Nama Ibu', width: 20 },
        { key: 'Jenis Institusi', header: 'Jenis Institusi', width: 15 },
        { key: 'Tahun Lulus', header: 'Tahun Lulus', width: 12 },
        { key: 'Angkatan', header: 'Angkatan', width: 12 },
        { key: 'Pekerjaan Sekarang', header: 'Pekerjaan Sekarang', width: 25 },
        { key: 'Jabatan', header: 'Jabatan', width: 20 },
        { key: 'Perusahaan', header: 'Perusahaan', width: 25 },
        { key: 'Pendidikan Lanjutan', header: 'Pendidikan Lanjutan', width: 20 },
        { key: 'Universitas', header: 'Universitas', width: 25 },
        { key: 'Jurusan', header: 'Jurusan', width: 20 },
        { key: 'Status Pernikahan', header: 'Status Pernikahan', width: 15 },
        { key: 'Nama Pasangan', header: 'Nama Pasangan', width: 20 },
        { key: 'Jumlah Anak', header: 'Jumlah Anak', width: 10, type: 'number' },
        { key: 'Kenangan', header: 'Kenangan', width: 40 },
        { key: 'Pesan untuk Juniors', header: 'Pesan untuk Juniors', width: 40 },
        { key: 'Bersedia Diundang Acara', header: 'Bersedia Diundang Acara', width: 20 },
        { key: 'Terakhir Dihubungi', header: 'Terakhir Dihubungi', width: 15, type: 'date' },
        { key: 'Tanggal Dibuat', header: 'Tanggal Dibuat', width: 15, type: 'date' }
      ]
    });

  } catch (error) {
    console.error('Export alumni error:', error);
    return NextResponse.json(
      { error: 'Failed to export alumni data' },
      { status: 500 }
    );
  }
}