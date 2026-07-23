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
      
      price: '200 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_02',
      
      price: '50 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_03',
      
      price: '400 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_04',
      
      price: '400 - 700 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_05',
      
      price: '900 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_06',
      
      price: '1 200 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_07',
      
      price: '1 700 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_08',
      
      price: '2 200 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_09',
      
      price: '2 200 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_10',
      
      price: '1 800 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_11',
      
      price: '600 - 700 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_12',
      
      price: '300 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_13',
      
      price: '350 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_14',
      
      price: '2 000 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_15',
      
      price: '2 500 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_16',
      
      price: '3 500 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_17',
      
      price: '700 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_18',
      
      price: '700 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_19',
      
      price: '500 - 1 000 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_20',
      
      price: '1800 - 2500 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_21',
      
      price: '400 - 800 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_22',
      
      price: '600 - 1 200 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_23',
      
      priceNoteKey: 'PRICES_PAGE.INDIVIDUAL_PRICING_SHORT',
      pricePrefixKey: 'PRICES_PAGE.FROM',
      price: '1 000 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_24',
      
      priceNoteKey: 'PRICES_PAGE.INDIVIDUAL_PRICING_SHORT',
      pricePrefixKey: 'PRICES_PAGE.FROM',
      price: '950 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_25',
      
      price: '3 200 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_26',
      
      price: '400 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_27',
      
      price: '400 zł',
      photo: '/assets/photos/Rafal.png',
    },
    {
      titleKey: 'PRICES_PAGE.ITEMS.ITEM_28',
      
      price: '3 300 zł',
      photo: '/assets/photos/Rafal.png',
    },
  ];
}
