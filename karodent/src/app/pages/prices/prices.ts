import {
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import {
  DOCUMENT,
  isPlatformBrowser,
} from '@angular/common';

interface PriceItem {
  titleKey: string;
  descriptionKey: string;
  priceNoteKey?: string;
  pricePrefixKey?: string;
  price: string;
  photo: string;
}

@Component({
  selector: 'app-prices',
  standalone: false,
  templateUrl: './prices.html',
  styleUrl: './prices.css',
})
export class Prices {
  private readonly isBrowser: boolean;

  constructor(
    @Inject(DOCUMENT)
    private readonly document: Document,
    @Inject(PLATFORM_ID)
    platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  scrollToFooter(): void {
    if (!this.isBrowser) {
      return;
    }

    const footer =
      this.document.getElementById('page-footer');

    footer?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  prices: PriceItem[] = [
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_01',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '200 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_02',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '50 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_03',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '400 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_04',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '400 - 700 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_05',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '900 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_06',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '1 200 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_07',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '1 700 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_08',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '2 200 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_09',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '2 200 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_10',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '1 800 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_11',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '600 - 700 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_12',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '300 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_13',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '350 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_14',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '2 000 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_15',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '2 500 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_16',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '3 500 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_17',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '700 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_18',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '700 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_19',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '500 - 1 000 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_20',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '1800 - 2500 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_21',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '400 - 800 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_22',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '600 - 1 200 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_23',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      priceNoteKey: 'PRICES_PAGE.INDIVIDUAL_PRICING_SHORT',
      pricePrefixKey: 'PRICES_PAGE.FROM',
      price: '1 000 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_24',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      priceNoteKey: 'PRICES_PAGE.INDIVIDUAL_PRICING_SHORT',
      pricePrefixKey: 'PRICES_PAGE.FROM',
      price: '950 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_25',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '3 200 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_26',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '400 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_27',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '400 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_28',
      descriptionKey: 'PRICES_PAGE.COMMON_DESCRIPTION',
      price: '3 300 zł',
      photo: '/assets/photos/Rafal.png',
    },
  ];
}
