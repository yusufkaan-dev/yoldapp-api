import { Body, Controller, Post, Req } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';

@Controller('location')
export class LocationDriverController {
  constructor(private readonly locationService: LocationService) {}

  // MVP: Driver konum ping (auth/roles sonradan tekrar eklenecek)
  @Post('ping')
  async ping(@Req() req: any, @Body() dto: CreateLocationDto) {
    // Eğer auth varsa req.user içinden yakalar; yoksa body’den userId bekler (geçici)
    const userId = req.user?.sub || req.user?.userId || req.user?.id || (dto as any).userId;

    if (!userId) {
      // Burada hata fırlatmak istersen ekleyebilirsin:
      // throw new BadRequestException('Missing userId (auth not wired yet)');
      // Şimdilik direkt servis patlatmasın diye minimal bıraktım:
      return { ok: false, error: 'Missing userId (auth not wired yet)' };
    }

    return this.locationService.ingestDriverLocation(userId, dto);
  }
}