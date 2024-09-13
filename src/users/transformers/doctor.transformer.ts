export class DoctorTransformer {
  transform(doctor) {
    return {
      avatar: doctor.photo,
      cta: {
        label: 'Book Appointment',
        path: doctor.url_slug,
      },
      display_name: doctor.display_name,
      introduction: doctor.doctor_introduction,
      qualifications: doctor.qualifications,
      slug: doctor.url_slug,
      speciality: doctor.specialities[0]?.name,
      doctor_exists: true,
    };
  }
}
