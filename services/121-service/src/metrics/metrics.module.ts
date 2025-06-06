import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActionsModule } from '@121-service/src/actions/actions.module';
import { EventsModule } from '@121-service/src/events/events.module';
import { MetricsController } from '@121-service/src/metrics/metrics.controller';
import { MetricsService } from '@121-service/src/metrics/metrics.service';
import { IntersolveVisaModule } from '@121-service/src/payments/fsp-integration/intersolve-visa/intersolve-visa.module';
import { IntersolveVoucherModule } from '@121-service/src/payments/fsp-integration/intersolve-voucher/intersolve-voucher.module';
import { SafaricomTransferEntity } from '@121-service/src/payments/fsp-integration/safaricom/entities/safaricom-transfer.entity';
import { PaymentsModule } from '@121-service/src/payments/payments.module';
import { TransactionEntity } from '@121-service/src/payments/transactions/transaction.entity';
import { ProgramEntity } from '@121-service/src/programs/program.entity';
import { ProgramRegistrationAttributeEntity } from '@121-service/src/programs/program-registration-attribute.entity';
import { RegistrationDataModule } from '@121-service/src/registration/modules/registration-data/registration-data.module';
import { RegistrationsModule } from '@121-service/src/registration/registrations.module';
import { RegistrationScopedRepository } from '@121-service/src/registration/repositories/registration-scoped.repository';
import { RegistrationViewScopedRepository } from '@121-service/src/registration/repositories/registration-view-scoped.repository';
import { UserModule } from '@121-service/src/user/user.module';
import { createScopedRepositoryProvider } from '@121-service/src/utils/scope/createScopedRepositoryProvider.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProgramRegistrationAttributeEntity,
      ProgramEntity,
      SafaricomTransferEntity,
    ]),
    UserModule,
    RegistrationsModule,
    ActionsModule,
    PaymentsModule,
    IntersolveVisaModule,
    IntersolveVoucherModule,
    EventsModule,
    RegistrationDataModule,
  ],
  providers: [
    MetricsService,
    RegistrationScopedRepository,
    RegistrationViewScopedRepository,
    createScopedRepositoryProvider(TransactionEntity),
  ],
  controllers: [MetricsController],
  exports: [],
})
export class MetricsModule {}
