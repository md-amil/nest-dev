import axios from 'axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { endpoints } from 'src/config';
import { CacheService } from '../common/services/cache.service';
import { DoctorTransformer } from './transformers/doctor.transformer';

@Injectable()
export class DoctorsService {
  private doctorTransformer = new DoctorTransformer();

  constructor(private cacheService: CacheService) {}

  getDoctor(doctor_id: string, display_name: string) {
    const doctor_info = {
      display_name,
      doctor_exists: false,
    };

    if (!doctor_id) return doctor_info;

    return this.cacheService.remember(
      `doctor_info_${doctor_id}`,
      async () => {
        try {
          return await this.fetchById(doctor_id);
        } catch (e) {
          // Do nothing...
          console.log(e.message);
        }

        return doctor_info;
      },
      60 * 60 * 12, // Cache doctor for 12 hours
    );
  }

  private async fetchById(doctor_id: string) {
    const response = await axios.get(
      `${endpoints.HRX_SEARCH}/v1/details/search`,
      {
        params: {
          index_type: 'DoctorSupplier',
          doctor_id,
        },
        timeout: 800, // ms
      },
    );

    if (response.data.data.results.results.length < 1) {
      throw new NotFoundException(
        `The doctor not found with id [${doctor_id}].`,
      );
    }

    return this.doctorTransformer.transform(
      response.data.data.results.results[0],
    );
  }
}
