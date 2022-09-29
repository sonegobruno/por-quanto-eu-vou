import { getRepository, Repository } from 'typeorm';
import { AppError } from '../../../../errors';
import { ICreateCarDTO } from '../../dtos/CreateCarDTO';
import { Car } from '../../entities/Car';
import { ICarsRepository } from '../ICarsRepository';

class CarRepository implements ICarsRepository{

    private repository: Repository<Car>

    constructor() {
        this.repository = getRepository(Car)
    }


    public async create(data: ICreateCarDTO) {
      try {
        const car = this.repository.create(data)
        await this.repository.save(car)
      } catch(err) {
        throw new AppError(err);
      }
    }

    public async listCarsByUserId(user_id: string): Promise<Car[]> {
      try {
        const cars = this.repository.find({
          where: {
            user_id
          }
        })

        return cars
      } catch(err) {
        throw new AppError(err);
      }
    }
}

export { CarRepository };