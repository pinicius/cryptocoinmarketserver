'use strict';

module.exports = function(Market) {

  function saveCoinsData(ctx) {
    var model = ctx.instance;
    var coinMarketCapService = Market.app.datasources.CoinMarketCapService;
    var CoinData = Market.app.models.CoinData;

    coinMarketCapService.fetchData('EUR', function(err, response, context) {
      if(err) throw err;
      if(response.error) {
        next('> response error: ' + response.error.stack);
      }
      model.ticker = response;
      model.lastUpdated = new Date();
      for(let i = 0; i < response.length; i++) {
        console.log('Coin Data: ', response[i]);
        CoinData.create(
          {
            cmcId: response[i].id,
            name: response[i].name,
            symbol: response[i].symbol,
            rank: response[i].rank,
            priceUSD: response[i].price_usd,
            priceEUR: response[i].price_eur,
            priceBTC: response[i].price_btc,
            volumeUSD24h: response[i]['24h_volume_usd'],
            volumeEUR24h: response[i]['24h_volume_eur'],
            marketCapUSD: response[i].market_cap_usd,
            marketCapEUR: response[i].market_cap_eur,
            availableSupply: response[i].available_supply,
            totalSupply: response[i].total_supply,
            percentChange1h: response[i].percent_change_1h,
            percentChange7d: response[i].percent_change_7d,
            percentChange24h: response[i].percent_change_24h,
            lastUpdated: response[i].last_updated,
            marketId: 1 //only have one market (CoinMarketCap)
          }, function(err, coinData) {
            if(err) throw err;
          });
        }
      console.log('> Market (all coins data) fetched successfully from remote server');
    });
  }

  Market.observe('before save', function(ctx, next) {
    console.log('> Market before save triggered');

    saveCoinsData(ctx);
    next();
  });

  Market.observe('after save', function(ctx, next) {
    console.log('> After create the market and loaded all the coins data');

    setInterval(function(){saveCoinsData(ctx)}, 4*60*1000); //every 4 minutes
    next();
  });
}
