var config = {
    advertisementsApiUrl: 'https://api.mcmakler.de/v1/advertisements',
    maxResults: 10
};

function pageLoad() {
    var apartmentLayout = $('.apartment').clone();
    $('.apartment')[0].remove();
    loadAds(apartmentLayout);
}

function loadAds(apartmentLayout) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'https://cors-anywhere.herokuapp.com/' + config.advertisementsApiUrl, //I wasn't sure how to properly proceed, because the change to allow cross domain access has to made on the server side
        success: function (result) {
            var data = result.data;
            var apartmentsList = $('#apartments-list');

            for (var i = 0; i < config.maxResults && i < data.length; i++) {
                var apartment = data[i];
                var card = loadApartmentCard(apartmentLayout, apartment);
                apartmentsList.append(card);
            }
        }
    });
}

function loadApartmentCard(apartmentLayout, apartment) {
    var card = apartmentLayout.clone();

    //Picture
    var pictureUrl = getApartmentPicture(apartment.advertisementAssets);
    card.find('.mdc-card__media').css('background-image', 'url(\'' + pictureUrl + '\')');

    //Button
    var buttonText = apartment.purpose === 0 ? 'Mieten' : 'Kaufen';
    card.find('.card-image-button').text(buttonText);

    //Title
    card.find('.mdc-card__title').html(apartment.title);

    //Apartment details
    var realestateSummary = apartment.realestateSummary;
    var address = realestateSummary.address;

    //Subtitle (address)
    var subtitle = Number(address.postalCode) + ' ' + address.street + ' / ' + address.city;
    card.find('.mdc-card__subtitle').html(subtitle);

    //Price
    var price = getFormattedApartmentPrice(apartment.advertisementPrice);
    card.find('.price').html(price);

    //Rooms
    card.find('.rooms').html(realestateSummary.numberOfRooms + ' Zimmer');

    //Area
    card.find('.area .meters').html(Math.floor(realestateSummary.space));

    return card;
}

function getApartmentPicture(advertisementAssets) {
    var asset = advertisementAssets[0];
    if (undefined === asset) {
        asset = advertisementAssets;
    }

    return asset.advertisementThumbnails.inventory_m.url;
}

function getFormattedApartmentPrice(advertisementPrice) {
    var price = advertisementPrice.sellPrice;
    if (undefined === price) {
        price = advertisementPrice.baseRent;
    }

    return $.number(price, 0, ',', '.') + ' &euro;';
}