import axios, { AxiosResponse } from 'axios';
import { NotFoundException } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { endpoints } from '../config';

jest.mock('axios');

describe('DoctorsService', () => {
  let doctorsService: DoctorsService;

  beforeEach(() => {
    doctorsService = new DoctorsService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getDoctor', () => {
    it('should return a doctor if found', async () => {
      const doctorId = '911670564320245001';
      const doctor = {
        id: '122309',
        supplier_id: '76681989918573391',
        doctor_id: '76681989715114343',
        display_name: 'Dr. Swati Pullewar',
        doctor_introduction: '',
        name: 'Swati Pullewar',
        mrn: '2011072542',
        services: [
          {
            name: 'Diagnosis and treatment',
          },
          {
            name: 'Information and advice',
          },
          {
            name: 'Health and nutrition advice',
          },
          {
            name: 'Prescription of medications',
          },
        ],
        awards: [],
        photo:
          'https://doctorlistingingestionpr.azureedge.net/76681989715114343_c3260444a23711ed9410c677abd75269_doc_profile_image.jpg',
        url_slug: 'pune/gynaecologist-and-obstetrician/dr-swati-pullewar',
        bfhl_logo: true,
        is_verified: false,
        video_consult: true,
        in_clinic: true,
        InstaSpec: null,
        InstaSpecFee: null,
        is_opt_for_listing: true,
        searchtags: [],
        qualifications: [
          {
            degree_type: 1,
            degree: 'MBBS',
            passing_year: '',
            college: '',
          },
          {
            degree_type: 2,
            degree: 'Diploma in Obstetrics and Gynaecology',
            passing_year: '',
            college: '',
          },
        ],
        language_spoken: ['English', 'हिन्दी', 'मराठी'],
        name_initials: 'SP',
        specialities: [
          {
            name: 'Gynaecologist and Obstetrician',
          },
        ],
        parentSpecialities: [
          {
            name: 'Gynaecologist and Obstetrician',
          },
        ],
        fees: 600,
        display_fees: '₹ 600',
        experience: '12 Years Experience',
        clinic: {
          name: 'Mothers Bliss',
          phone_number: '9209382847',
          logo: '',
          photos: [],
          address: {
            locality: 'Lohegaon',
            line1: '283/1, Porwal Rd, Near Kand Nagar Chowk',
            line2: 'Kand Nagar, Kutwal Colony, Lohegaon',
            city: 'Pune',
            state: 'Maharashtra',
            country: 'India',
            zip_code: '411047',
            location: '73.90968,18.60344',
          },
          timings: {
            overview: {
              start: '06:00PM',
              end: '08:00PM',
            },
            detailed: [
              {
                day: 'Monday',
                details: [
                  {
                    start: '6:00PM',
                    end: '8:00PM',
                  },
                  {
                    start: '11:00AM',
                    end: '1:00PM',
                  },
                ],
              },
              {
                day: 'Tuesday',
                details: [
                  {
                    start: '6:00PM',
                    end: '8:00PM',
                  },
                  {
                    start: '11:00AM',
                    end: '1:00PM',
                  },
                ],
              },
              {
                day: 'Wednesday',
                details: [
                  {
                    start: '6:00PM',
                    end: '8:00PM',
                  },
                  {
                    start: '11:00AM',
                    end: '1:00PM',
                  },
                ],
              },
              {
                day: 'Thursday',
                details: [
                  {
                    start: '6:00PM',
                    end: '8:00PM',
                  },
                  {
                    start: '11:00AM',
                    end: '1:00PM',
                  },
                ],
              },
              {
                day: 'Friday',
                details: [
                  {
                    start: '6:00PM',
                    end: '8:00PM',
                  },
                  {
                    start: '11:00AM',
                    end: '1:00PM',
                  },
                ],
              },
              {
                day: 'Saturday',
                details: [
                  {
                    start: '6:00PM',
                    end: '8:00PM',
                  },
                  {
                    start: '11:00AM',
                    end: '1:00PM',
                  },
                ],
              },
            ],
          },
        },
        offers: [],
        ctas: [
          {
            type: 'BOOK-IN CLINIC',
            data: {
              mode_of_payment: 'PAY_ONLINE',
            },
          },
        ],
        prime: false,
        teleconsultation_fees: '₹ 400',
        vr_number: '',
        payee_id: '6311cc6454a853001f0e1764',
        telemed_fee: 400,
        badges: [
          {
            type: 'Verified Doctors',
          },
        ],
        with_this_booking: [
          {
            text: 'Inclinic Consultation',
            iconName: 'home',
            iconUrl:
              'https://bajajfinservhealth.azureedge.net/png/test/3f917540-a8ac-4eb3-9e59-9aa01e9192a2.png',
            subtitle:
              'Seek personalized medical advice from our wide network of doctors at their clinic',
          },
          {
            text: 'Video Consultation',
            iconName: 'videocam',
            iconUrl:
              'https://bajajfinservhealth.azureedge.net/png/test/c8b02f26-bb42-4fc0-bf06-15a75b23e181.png',
            subtitle:
              'You can seek medical advice right from where you are. The Doctor is also available for video consultations',
          },
          {
            text: 'Online Payment',
            iconName: 'account-balance-wallet',
            iconUrl:
              'https://bajajfinservhealth.azureedge.net/png/test/0b4c9e55-0ffd-472f-a458-d4e47ad28680.png',
            subtitle:
              'You can pay for your consultation easily via net banking, digital wallets, or debit/credit card',
          },
        ],
        gender: 'FEMALE',
        no_vouchers: false,
        no_products: false,
        created_date: 1654518788000,
        total_consultations: 735,
        distance: '14 km',
        online_status: false,
        ebh_plus: true,
        healthpay: 1,
        type_of_service: 'OPD',
        isFar: false,
        doctorTreatments: [],
      };
      const response = {
        data: {
          data: {
            results: {
              results: [doctor],
            },
          },
        },
      };
      (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(
        response as AxiosResponse,
      );

      const result = await doctorsService.getDoctor(doctorId);

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(
        `${endpoints.HRX_SEARCH}/v1/details/search`,
        {
          params: {
            index_type: 'DoctorSupplier',
            doctor_id: doctorId,
          },
        },
      );
      expect(result).toEqual(doctor);
    });

    it('should throw a NotFoundException if no doctor is found', async () => {
      const doctorId = '911670564320245001';
      const response = {
        data: {
          data: {
            results: {
              results: [],
            },
          },
        },
      };
      (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue(
        response as AxiosResponse,
      );

      await expect(doctorsService.getDoctor(doctorId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
