import { Component } from '@angular/core';

interface PriceItem {
  title: string;
  description: string;
  priceNote?: string;
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
  scrollToFooter() {
    const footer = document.getElementById('page-footer');
    if (footer) footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  prices: PriceItem[] = [
    {
      title: 'Konsultacja lekarska oraz badanie stomatologiczne',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '200 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Zdjęcie RTG wewnątrzustne - zębowe',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '50 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Zabieg higienizacji - scaling, piaskowanie, fluoryzacja',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '400 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Wypełnienie kompozytowe',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '400 - 700 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Rekonstrukcja kompozytowa bezpośrednia - licówka / overlay',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '900 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Wybielanie metodą nakładkową',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '1 200 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Wybielanie metodą laserową',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '1 700 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Korona pełnoceramiczna',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '2 200 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Licówka ceramiczna',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '2 200 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Onlay kompozytowy CAD/CAM',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '1 800 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Wkład koronowo-korzeniowy (włókno szklane/tytan)',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '600 - 700 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Demontaż pracy z filaru protetycznego',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '300 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Higienizacja',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '350 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Most tymczasowy Maryland',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '2 000 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Proteza akrylowa',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '2 500 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Proteza szkieletowa',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '3 500 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Leczenie biologiczne miazgi - Biodentine',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '700 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Leczenie kanałowe (za 1 kanał)',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '700 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Usunięcie wkładu lub złamanego narzędzia',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '500 - 1 000 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Mikrochirurgia endodontyczna (resekcja wierzchołka korzenia)',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '1800 - 2500 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Usunięcie zęba (ekstrakcja)',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '400 - 800 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Usunięcie ósemki (ekstrakcja trzeciego zęba trzonowego)',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '600 - 1 200 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Odbudowa kości (augmentacja)',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      priceNote: 'wyc. ind.',
      price: 'od 1 000 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Wykonanie planu chirurgicznego oraz szablonu do implantacji nawigowanej',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      priceNote: 'wyc. ind.',
      price: 'od 950 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Implant zębowy (MIS Conincal Connection)',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '3 200 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Filar MIS Connect',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '400 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Śruba gojąca MIS (zabieg odsłonięcia implantu)',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '400 zł',
      photo: '/assets/photos/Rafal.png'
    },
    {
      title: 'Korona pełnoceramiczna na implancie MIS',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      price: '3 300 zł',
      photo: '/assets/photos/Rafal.png'
    }
  ];
}
