import { HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { env } from '@mock-service/src/env';
import { IntersolveVisaMockResponseDto } from '@mock-service/src/fsp-integration/intersolve-visa/intersolve-visa-mock-response.dto';

export enum IntersolveVisaWalletStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Redeemed = 'REDEEMED',
  Substituted = 'SUBSTITUTED',
  Expired = 'EXPIRED',
  Disabled = 'DISABLED',
}

export enum IntersolveVisaCardStatus {
  CardOk = 'CARD_OK',
  CardBlocked = 'CARD_BLOCKED',
  SuspectedFraud = 'SUSPECTED_FRAUD',
  CardClosedDueToFraud = 'CARD_CLOSED_DUE_TO_FRAUD',
  CardNoRenewal = 'CARD_NO_RENEWAL',
  CardStolen = 'CARD_STOLEN',
  CardLost = 'CARD_LOST',
  CardClosed = 'CARD_CLOSED',
  CardExpired = 'CARD_EXPIRED',
}

// This is a magic number that will cause the transfer to fail due to a duplicate operation reference (idempotency key)
// It's used in the API tests to verify that the API handles this case correctly
const MAGIC_FAIL_OPERATION_REFERENCE_AMOUNT = 15.15;

@Injectable()
export class IntersolveVisaMockService {
  public createCustomerMock(
    dto: Record<string, any>,
  ): IntersolveVisaMockResponseDto {
    const res = new IntersolveVisaMockResponseDto();
    res.data = {
      success: true,
      errors: [],
      code: 'string',
      correlationId: 'string',
      data: {
        id: `mock-${uuid()}`,
        externalReference: dto.externalReference,
        blocked: false,
        unblockable: false,
        createdAt: '2023-02-08T14:36:05.816Z',
      },
    };
    const lastName = dto.individual.lastName
      ? dto.individual.lastName.toLowerCase()
      : '';

    if (lastName.includes('mock-fail-create-customer')) {
      res.data.success = false;
      res.data.errors.push({
        code: 'NOT_FOUND',
        field: 'mock field',
        description: 'We mocked that creating customer failed',
      });
      res.status = HttpStatus.NOT_FOUND;
      res.statusText = 'NOT_FOUND';
    } else {
      res.status = HttpStatus.CREATED;
      res.statusText = 'OK';
    }
    // in all below cases,pass different holderId to use in follow-up API-call (which does not take lastName as input)
    if (
      lastName.includes('mock-fail-create-wallet') ||
      lastName.includes('mock-fail-link-customer-wallet') ||
      lastName.includes('mock-fail-create-debit-card') ||
      lastName.includes('mock-fail-load-balance') ||
      lastName.includes('mock-fail-get-wallet') ||
      lastName.includes('mock-fail-get-card') ||
      lastName.includes('mock-spent') ||
      lastName.includes('mock-current-balance')
    ) {
      res.data.data.id = lastName;
    }
    return res;
  }

  public createWalletMock(
    holderId: string | null,
  ): IntersolveVisaMockResponseDto {
    const response = new IntersolveVisaMockResponseDto();
    response.status = HttpStatus.OK;
    response.statusText = 'OK';

    response.data = {};
    response.data.success = true;
    response.data.errors = [];
    response.data.code = 'string';
    response.data.correlationId = 'string';

    response.data.data = {};
    response.data.data.token = {};
    response.data.data.token.code = `mock-token-${uuid()}`;
    response.data.data.token.blocked = false;
    response.data.data.token.blockReasonCode = 'string';
    response.data.data.token.tier = 'string';
    response.data.data.token.brandTypeCode = 'string';
    response.data.data.token.status = 'INACTIVE';
    response.data.data.token.holderId = 'string';
    response.data.data.token.balances = [
      {
        quantity: {
          assetCode: env.INTERSOLVE_VISA_ASSET_CODE,
          value: 0,
          reserved: 0,
        },
        discountBudgetValue: 0,
        lastChangedAt: '2023-02-08T14:36:05.816Z',
      },
    ];
    response.data.data.token.assets = [
      {
        identity: {
          type: 'string',
          subType: 'string',
          code: 'string',
        },
        groupCode: 'string',
        parentAssetCode: 'string',
        name: 'string',
        description: 'string',
        status: 'string',
        minorUnit: 0,
        tags: ['string'],
        conversions: [
          {
            toAssetCode: 'string',
            automatic: true,
            fromQuantity: 0,
            toQuantity: 0,
          },
        ],
        images: [
          {
            code: 'string',
            type: 'string',
            url: 'string',
            description: 'string',
          },
        ],
        vatRegulation: {
          code: 'string',
          value: 0,
        },
        termsAndConditions: {
          url: 'string',
          text: 'string',
        },
        amount: 0,
        currency: 'string',
        articleCode: 'string',
        percentage: 0,
        rank: 0,
        unit: 'string',
        promotionCode: 'string',
        ticket: 'string',
        chargeRestrictions: {
          product: {
            includes: ['string'],
            excludes: ['string'],
          },
          productGroup: {
            includes: ['string'],
            excludes: ['string'],
          },
        },
        allowedMethods: [
          {
            code: 'string',
            period: {
              start: '2023-02-08T14:36:05.817Z',
              end: '2023-02-08T14:36:05.817Z',
            },
            securityCodeInfo: {
              required: true,
              format: 'string',
            },
          },
        ],
      },
    ];

    if (holderId?.toLowerCase().includes('mock-fail-create-wallet')) {
      response.data.success = false;
      response.data.errors = [];
      response.data.errors.push({
        code: 'NOT_FOUND',
        field: 'mock field',
        description: 'We mocked that creating wallet failed',
      });
      response.status = HttpStatus.NOT_FOUND;
      response.statusText = 'NOT_FOUND';
    }
    // in all below cases,pass different tokenCode to use in follow-up API-call (which does not take holderId as input)
    // uuid is needed to not run into unqiue constraint on token code
    if (
      holderId?.toLowerCase().includes('mock-fail-link-customer-wallet') ||
      holderId?.toLowerCase().includes('mock-fail-create-debit-card') ||
      holderId?.toLowerCase().includes('mock-fail-load-balance') ||
      holderId?.toLowerCase().includes('mock-fail-get-wallet') ||
      holderId?.toLowerCase().includes('mock-fail-get-card') ||
      holderId?.toLowerCase().includes('mock-spent') ||
      holderId?.toLowerCase().includes('mock-current-balance')
    ) {
      response.data.data.token.code = `${uuid()}${holderId}`;
    }

    return response;
  }

  public linkCustomerToWalletMock(
    tokenCode: string | null,
  ): IntersolveVisaMockResponseDto {
    const res: IntersolveVisaMockResponseDto = {
      status: HttpStatus.NO_CONTENT,
      statusText: 'No Content',
      data: {},
    };
    if (tokenCode?.toLowerCase().includes('mock-fail-link-customer-wallet')) {
      res.data.success = false;
      res.data.errors = [];
      res.data.errors.push({
        code: 'NOT_FOUND',
        field: 'mock field',
        description: 'We mocked that linking wallet to customer failed',
      });
      res.status = HttpStatus.NOT_FOUND;
      res.statusText = 'NOT_FOUND';
    }
    return res;
  }

  public createDebitCardMock(
    lastName: string | null,
    mobileNumber: string | null,
  ): IntersolveVisaMockResponseDto {
    const res: IntersolveVisaMockResponseDto = {
      status: HttpStatus.OK,
      statusText: 'OK',
      data: {},
    };
    if (lastName?.toLowerCase().includes('mock-fail-create-debit-card')) {
      res.data.success = false;
      res.data.errors = [];
      res.data.errors.push({
        code: 'NOT_FOUND',
        field: 'mock field',
        description: 'We mocked that creating debit card failed',
      });
      res.status = HttpStatus.NOT_FOUND;
      res.statusText = 'NOT_FOUND';
    }
    const mobileNumberRegex = /^\+[1-9]\d{5,14}$/;
    if (!mobileNumberRegex.test(mobileNumber)) {
      res.data.success = false;
      res.data.errors = [];
      res.data.errors.push({
        code: 'INVALID_MOBILE_NUMBER',
        field: 'mobileNumber',
        description: 'Mobile number does not match the required format',
      });
      res.status = HttpStatus.BAD_REQUEST;
      res.statusText = 'BAD_REQUEST';
    }
    return res;
  }

  public loadBalanceCardMock(
    tokenCode: string | null,
  ): IntersolveVisaMockResponseDto {
    const response = {
      data: {
        success: true,
        errors: [],
        code: 'string',
        correlationId: 'string',
        data: {
          balances: [
            {
              quantity: {
                assetCode: env.INTERSOLVE_VISA_ASSET_CODE,
                value: 0,
                reserved: 0,
              },
              discountBudgetValue: 0,
              lastChangedAt: '2023-02-08T14:37:22.670Z',
            },
          ],
        },
      },
      status: HttpStatus.OK,
      statusText: 'OK',
    };
    if (tokenCode?.toLowerCase().includes('mock-fail-load-balance')) {
      response.data.success = false;
      response.data.errors.push({
        code: 'NOT_FOUND',
        field: 'mock field',
        description: 'We mocked that the load balance call failed',
      });
      response.status = HttpStatus.NOT_FOUND;
      response.statusText = 'NOT FOUND';
    }
    return response;
  }

  public unloadBalanceCardMock(): IntersolveVisaMockResponseDto {
    return {
      data: {
        success: true,
        errors: [],
        code: 'string',
        correlationId: 'string',
        data: {
          balances: [
            {
              quantity: {
                assetCode: env.INTERSOLVE_VISA_ASSET_CODE,
                value: 0, // return 0 because unload is only used to unload complete amount when re-issuing
                reserved: 0,
              },
              discountBudgetValue: 0,
              lastChangedAt: '2023-02-08T14:37:22.670Z',
            },
          ],
        },
      },
      status: HttpStatus.OK,
      statusText: 'OK',
    };
  }

  public getWalletMock(
    tokenCode: string | null,
  ): IntersolveVisaMockResponseDto {
    const match = tokenCode.match(/mock-current-balance-(\d+)/);
    let currentBalance;
    try {
      currentBalance = match ? parseInt(match[1], 10) : 2500;
    } catch (error) {
      currentBalance = 2500;
    }
    const response = new IntersolveVisaMockResponseDto();
    response.status = HttpStatus.OK;
    response.data = {
      success: true,
      code: 'string',
      correlationId: 'string',
      data: {
        code: 'string',
        blocked: false,
        status: IntersolveVisaWalletStatus.Active,
        balances: [
          {
            quantity: {
              assetCode: env.INTERSOLVE_VISA_ASSET_CODE,
              value: currentBalance,
              reserved: 0,
            },
            discountBudgetValue: 0,
            lastChangedAt: new Date(
              new Date().setDate(new Date().getDate() - 7), // 7 days ago
            ).toISOString(),
          },
        ],
      },
    };

    if (tokenCode?.toLowerCase().includes('mock-fail-get-wallet')) {
      response.data.success = false;
      if (!response.data.errors) {
        response.data.errors = [];
      }
      response.data.errors.push({
        code: 'NOT_FOUND',
        field: 'mock field',
        description: 'We mocked that the get wallet call failed',
      });
      response.status = HttpStatus.NOT_FOUND;
      response.statusText = 'NOT FOUND';
    }
    return response;
  }

  public getCardMock(tokenCode: string | null): IntersolveVisaMockResponseDto {
    let returnStatus = IntersolveVisaCardStatus.CardOk;
    if (tokenCode?.toLowerCase().includes('mock-fail-get-card')) {
      const substring = tokenCode.replace('mock-fail-get-card', '');
      for (const status of Object.values(IntersolveVisaCardStatus)) {
        if (substring.toLowerCase().includes(status.toLowerCase())) {
          returnStatus = status;
        }
      }
    }

    const response = new IntersolveVisaMockResponseDto();
    response.status = HttpStatus.OK;
    response.data = {
      success: true,
      errors: [],
      code: 'string',
      correlationId: 'string',
      data: {
        status: returnStatus,
      },
    };
    return response;
  }

  public getTransactionsMock(
    tokenCode: string | null,
  ): IntersolveVisaMockResponseDto {
    const response = new IntersolveVisaMockResponseDto();
    response.status = HttpStatus.OK;
    response.data = {
      code: 'string',
      correlationId: 'string',
      success: true,
      data: [
        {
          id: 1,
          quantity: {
            assetCode: env.INTERSOLVE_VISA_ASSET_CODE,
            value: -300, // Reservations are negative and in cents
          },
          createdAt: new Date(
            new Date().setDate(new Date().getDate()),
          ).toISOString(),
          creditor: {
            tokenCode: 'random token code',
          },
          debtor: {
            tokenCode,
          },
          reference: 'string',
          type: 'RESERVATION',
          description: 'string',
          location: {
            merchantCode: 'string',
            merchantLocationCode: 'string',
          },
          originalTransactionId: 1,
          paymentId: 1,
        },
        {
          id: 1,
          quantity: {
            assetCode: env.INTERSOLVE_VISA_ASSET_CODE,
            value: 300,
          },
          createdAt: new Date(
            new Date().setDate(new Date().getDate()),
          ).toISOString(),
          creditor: {
            tokenCode: 'random token code',
          },
          debtor: {
            tokenCode,
          },
          reference: 'string',
          type: 'CHARGE',
          description: 'string',
          location: {
            merchantCode: 'string',
            merchantLocationCode: 'string',
          },
          originalTransactionId: 1,
          paymentId: 1,
        },
      ],
    };
    if (tokenCode?.toLowerCase().includes('mock-spent')) {
      // gets the numberic values from the token code after the mock-spent- string
      const match = tokenCode.match(/mock-spent-(\d+)/);
      let spentAmount;
      try {
        spentAmount = match ? parseInt(match[1], 10) : 0;
      } catch (error) {
        spentAmount = 200;
      }
      response.data.data = [
        {
          id: 1,
          quantity: {
            assetCode: env.INTERSOLVE_VISA_ASSET_CODE,
            value: -spentAmount,
          },
          createdAt: new Date(
            new Date().setDate(new Date().getDate()),
          ).toISOString(),
          creditor: {
            tokenCode: 'random token code',
          },
          debtor: {
            tokenCode,
          },
          reference: 'string',
          type: 'RESERVATION',
          description: 'string',
          location: {
            merchantCode: 'string',
            merchantLocationCode: 'string',
          },
          originalTransactionId: 1,
          paymentId: 1,
        },
      ];

      response.data.data!.push({
        id: 1,
        quantity: {
          assetCode: env.INTERSOLVE_VISA_ASSET_CODE,
          value: -300,
        },
        createdAt: new Date(
          new Date().setMonth(new Date().getMonth() - 2),
        ).toISOString(),
        creditor: {
          tokenCode: 'random token code',
        },
        debtor: {
          tokenCode,
        },
        reference: 'string',
        type: 'RESERVATION',
        description: 'string',
        location: {
          merchantCode: 'string',
          merchantLocationCode: 'string',
        },
        originalTransactionId: 1,
        paymentId: 1,
      });
    }

    return response;
  }

  public toggleBlockWalletMock(): IntersolveVisaMockResponseDto {
    // for the response it does not matter if it's blocked or unblocked
    const res: IntersolveVisaMockResponseDto = {
      status: HttpStatus.NO_CONTENT,
      statusText: 'No Content',
      data: {},
    };
    return res;
  }

  public activateWalletMock(
    tokenCode: string | null,
  ): IntersolveVisaMockResponseDto {
    const response = new IntersolveVisaMockResponseDto();
    response.status = HttpStatus.OK;
    response.data = {
      success: true,
      errors: [],
      code: 'string',
      correlationId: 'string',
      data: {
        code: tokenCode ?? '',
        status: IntersolveVisaWalletStatus.Active,
        balances: [
          {
            quantity: {
              assetCode: env.INTERSOLVE_VISA_ASSET_CODE,
              value: 2500,
              reserved: 0,
            },
            discountBudgetValue: 0,
            lastChangedAt: new Date(
              new Date().setDate(new Date().getDate() - 7), // 7 days ago
            ).toISOString(),
          },
        ],
      },
    };
    return response;
  }

  public updateCustomerPhoneNumber(
    payload: Record<string, string>,
  ): IntersolveVisaMockResponseDto {
    if (!payload.value || payload.value.includes('undefined')) {
      return {
        status: HttpStatus.BAD_REQUEST,
        statusText: 'Bad Request',
        data: {
          success: false,
          errors: [
            {
              code: 'INVALID_PARAMETERS',
              field: 'value',
              description: 'The field value is required.',
            },
          ],
        },
      };
    }
    return {
      status: HttpStatus.OK,
      statusText: 'OK',
      data: {
        success: true,
      },
    };
  }

  public updateCustomerAddress(
    payload: Record<string, string>,
  ): IntersolveVisaMockResponseDto {
    const addresKeys = ['addressLine1', 'city', 'postalCode', 'country'];
    for (const key of addresKeys) {
      if (!payload[key] || payload[key].includes('undefined')) {
        return {
          status: HttpStatus.BAD_REQUEST,
          statusText: 'Bad Request',
          data: {
            success: false,
            errors: [
              {
                code: 'INVALID_PARAMETERS',
                field: key,
                description: `The ${key} field is required.`,
              },
            ],
          },
        };
      }
    }
    return {
      status: HttpStatus.OK,
      statusText: 'OK',
      data: {
        success: true,
      },
    };
  }

  public linkToken(parentTokenCode: string): IntersolveVisaMockResponseDto {
    if (parentTokenCode.includes('mock-fail-link-token')) {
      return {
        status: HttpStatus.NOT_FOUND,
        statusText: 'Not Found',
        data: {
          success: false,
          errors: [
            {
              code: 'NOT_FOUND',
              description: 'We mocked that linking the token failed',
            },
          ],
        },
      };
    }
    return {
      status: HttpStatus.OK,
      statusText: 'OK',
      data: {
        success: true,
      },
      errors: [],
    };
  }

  public transfer(
    toToken: string,
    amount: number,
  ): IntersolveVisaMockResponseDto {
    if (amount === MAGIC_FAIL_OPERATION_REFERENCE_AMOUNT * 100) {
      return {
        status: HttpStatus.BAD_REQUEST,
        statusText: 'Not Found',
        data: {
          code: 'INVALID_PARAMETERS',
          field: 'operationReference',
          correlationId: uuid(),
          success: false,
          errors: [
            {
              code: 'FIELD_IS_NOT_UNIQUE',
              field: 'operationReference',
              description: 'Operation reference is already used.',
            },
          ],
        },
      };
    }
    if (toToken.includes('mock-fail-transfer')) {
      // We assume this is the correct response for a failed transfer
      // However I do not know a scenario where this would fail, maybe when our token code does not exist or is out of funding
      return {
        status: HttpStatus.NOT_FOUND,
        statusText: 'Not Found',
        data: {
          success: false,
          errors: [
            {
              code: 'NOT_FOUND',
              description: 'We mocked that transfer failed',
            },
          ],
        },
      };
    }
    // Return error if the amount is not an integer
    // If we post a non integer to the real API, it will return a similar error
    if (!Number.isInteger(amount)) {
      return {
        status: HttpStatus.BAD_REQUEST,
        statusText: 'Bad Request',
        data: {
          success: false,
          errors: [
            {
              code: 'INVALID_PARAMETERS',
              description:
                'The JSON value could not be converted to System.Int32',
            },
          ],
        },
      };
    }

    return {
      status: HttpStatus.OK,
      statusText: 'OK',
      data: {
        success: true,
      },
      errors: [],
    };
  }

  public substituteToken(token: string): IntersolveVisaMockResponseDto {
    // TODO create API for this and add to import ocw registration .csv
    if (token.includes('mock-fail-substitute')) {
      // We assume this is the correct response for a failed substitution
      // However, the exact failure scenario depends on your application's requirements
      return {
        status: HttpStatus.NOT_FOUND,
        statusText: 'Not Found',
        data: {
          success: false,
          errors: [
            {
              code: 'NOT_FOUND',
              description: 'We mocked that token substitution failed',
            },
          ],
        },
      };
    }

    return {
      status: HttpStatus.OK,
      statusText: 'OK',
      data: {
        success: true,
      },
      errors: [],
    };
  }
}
