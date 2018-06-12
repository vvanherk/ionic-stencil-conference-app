import { Component, Element, Prop } from '@stencil/core';
import Tunnel from '../../providers/state-tunnel';
import { LocationsState } from '../../providers/locations-state';

declare var google: any;

@Component({
  tag: 'page-map',
  styleUrl: 'page-map.css',
})
export class PageMap {
  @Prop() locations: LocationsState;

  @Element() el: HTMLStencilElement;

  async componentWillLoad() {
    await getGoogleMaps('AIzaSyB8pf6ZdFQj5qw7rc_HSGrhUwQKfIe9ICw');
  }

  async componentDidLoad() {
    const mapEle = this.el.querySelector('.map-canvas');

    const map = new google.maps.Map(mapEle, {
      center: this.locations.mapCenter,
      zoom: 16
    });

    this.locations.items.forEach((location) => {
      const infoWindow = new google.maps.InfoWindow({
        content: `<h5>${location.name}</h5>`
      });

      const marker = new google.maps.Marker({
        position: {
          lat: location.lat,
          lng: location.lng
        },
        map: map,
        title: location.name
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      google.maps.event.addListenerOnce(map, 'idle', () => {
        mapEle.classList.add('show-map');
      });
    });
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Map</ion-title>
        </ion-toolbar>
      </ion-header>,

      <div class="map-canvas"></div>
    ];
  }
}

function getGoogleMaps(apiKey: string): Promise<any> {
  const win = window as any;
  const google = win.google;
  if (google && google.maps) {
    return Promise.resolve(google.maps);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.31`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      const win = window as any;
      const google = win.google;
      if (google && google.maps) {
        resolve(google.maps);
      } else {
        reject('google maps not available');
      }
    };
  });
}

Tunnel.injectProps(PageMap, 'locations');
