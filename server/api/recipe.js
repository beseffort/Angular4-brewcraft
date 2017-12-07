var express = require('express');
var router = express.Router();
var fs = require('graceful-fs');
var Util = require('../lib/util');
var db = require('firebase').database();

var recipesRef = db.ref('recipes');

router.post('/submit', (req, res) => {
    var recipe = recipesRef.push();

    // if (req.body.photo) {
    //     var filepath = '/recipes/' + recipe.key;
    //     Util.uploadPhoto(req.body.photo, filepath);
    //     req.body.photo = filepath;
    // } else {
    //     req.body.photo = '/recipes/default.png';
    // }
    req.body.uid = recipe.key;
    recipe.setWithPriority(req.body, 0 - Date.now())
        .then(result => { 
          var userRef = db.ref('users/'+req.body.brewerID);
          userRef.once('value' , (snapshot) => {
            var user = snapshot.val();
            if(user.recipes != null){
              user.recipes += 1;
            }else{
              user.recipes = 1;
            }
            userRef.update(user);
          })
          Util.responseHandler(res, true, "", 0 - Date.now());
        })
        .catch(error => Util.responseHandler(res, false, error.message))
});

router.post('/get', (req, res) => {
    var userId = req.body.userId;
    recipesRef.once('value', (snapshot) => {
        if (snapshot.val() == null) {
            Util.responseHandler(res, false);
            return;
        } else {
            var recipes = [];
            for (var key in snapshot.val()) {
                if (snapshot.val().hasOwnProperty(key)) {
                    var element = snapshot.val()[key];
                    if(element.brewerID == userId || element.privacy == 'PUBLIC'){
                      element.recipeLikeCount = (element.likedUsers != undefined)?element.likedUsers.length:0;
                      if(element.likedUsers != undefined && element.likedUsers.indexOf(userId) != -1){
                        element.isLike = true;
                      }else{
                        element.isLike = false;
                      }
                      recipes.push(element);
                    }
                }
            }
            Util.responseHandler(res, true, '', recipes);
        }
    })
})

router.get('/get/:uid', (req, res) => {
    recipesRef.orderByKey().equalTo(req.params.uid).once('value', (snapshot) => {
        if (snapshot.val() == null) {
            Util.responseHandler(res, false);
            return;
        } else {
            var recipes = [];
            for (var key in snapshot.val()) {
                if (snapshot.val().hasOwnProperty(key)) {
                    var element = snapshot.val()[key];
                    recipes.push(element);
                }
            }
            Util.responseHandler(res, true, '', recipes);
        }
    })
})

router.post('/search', (req, res) => {
    var keyword = new RegExp(req.body.keyword, "i");

    recipesRef.once('value', (snapshot) => {
        var recipes = snapshot.val();
        var result = [];
        for (var key in recipes) {
            if (recipes.hasOwnProperty(key)) {
                var recipe = recipes[key];
                if (recipe.name.search(keyword) != -1 || recipe.brewer.search(keyword) != -1)
                    result.push(recipe)
            }
        }
        Util.responseHandler(res, true, "Success", result);
    })
})

router.get('/get-beer-types', (req, res) => {

    recipesRef.once('value', (snapshot) => {
        var recipes = snapshot.val();
        var result = [];
        for (var key in recipes) {
            if (recipes.hasOwnProperty(key)) {
                var recipe = recipes[key];
            }
        }
        Util.responseHandler(res, true, "Success", result);
    })
})

router.post('/submit-review', (req, res) => {
    var recipeId = req.body.recipeId;

    var review = {
        username: req.body.writerName,
        userId: req.body.writerId,
        note: req.body.review,
        date: new Date()
    }

    db.ref('recipes/' + recipeId).once('value', (snapshot) => {
        var recipe = snapshot.val();
        if (!recipe.reviews)
            recipe.reviews = [];
        recipe.reviews.unshift(review);
        db.ref('recipes/' + recipeId).update({reviews: recipe.reviews});
        // update opinions in users 
        db.ref('users/' + req.body.writerId).once('value', (snapshot) => {
          db.ref('users/' + req.body.writerId).update({opinions: snapshot.val().opinions ? snapshot.val().opinions + 1: 1});
        });
        Util.responseHandler(res, true);
    });
})

router.get('/:uid/reviews', (req, res) => {
    var recipeId = req.params.uid;

    db.ref('recipes/' + recipeId).once('value', (snapshot) => {
        var reviews = snapshot.val().reviews;
        if(!reviews) reviews = [];
        Util.responseHandler(res, true, '', reviews);
    });
})

router.get('/hopsTypes', (req, res) => {
    var hopsTypes = [
             'ADDMIRAL',
             'AHTANUM',
             'AMARILLO',
             'ARAMIS',
             'AURORA',
             'BITTER GOLD',
             'BLANC',
             'BOBEK',
             'BRAMLING CROSS',
             'BRAVO',
             'BREWERS GOLD(UNITED STATES)',
             'BREWERS GOLD(GERMANY)',
             'BULLION',
             'CASCADE',
             'CELEIA',
             'CENTENNIAL',
             'CHALLENGER',
             'CHELAN',
             'CHINOOK',
             'CITRA',
             'CLUSTER',
             'COLUMBUS',
             'COMET',
             'CRYSTAL',
             'DR. RUDI',
             'EAST KENT GOLDING',
             'EKUANOT™(BRAND HBC 366)',
             'ELLA',
             "FALCONER'S FLIGHT 7C'S®",
             "FALCONER'S FLIGHT®",
             "FIRST GOLD",
             "FUGGLE",
             "GALAXY",
             "GALENA",
             "GLACIER",
             "GOLD",
             "GOLDING(UNITED STATES)",
             "GOLDING(UNITED KINGDOM)",
             "GREEN BULLET",
             "HALLERTAU",
             "HALLERTAU MITTLEFRUH",
             "HBC 431",
             "HBC 438",
             "HBC 472",
             "HBC 682",
             "HELGA",
             "HERKULES",
             "HERSBRUCKER",
             "HORIZON",
             "HUELL MELON",
             "KOHATU",
             "LIBERTY",
             "LORAL™(BRAND HBC 291)",
             "MAGNUM(UNITED STATES)",
             "MAGNUM(GERMANY)",
             "MANDARINA BAVARIA",
             "MERKUR",
             "MILLENNIUM",
             "MOSAIC®(BRAND HBC 369)",
             "MOTUEKA",
             "MT. HOOD",
             "MT. RAINIER",
             "NELSON SAUVIN",
             "NEWPORT",
             "NORTHDOWN",
             "NORTHERN BREWER(UNITED STATES)",
             "NORTHERN BREWER(GERMANY)",
             "NUGGET(UNITED STATES)",
             "NUGGET(GERMANY)",
             "OPAL",
             "PACIFIC GEM",
             "PACIFIC JADE",
             "PACIFICA",
             "PALISADE®(BRAND YCR 4)",
             "PERLE(UNITED STATES)",
             "PERLE(GERMANY)",
             "PHOENIX",
             "PILGRIM",
             "PIONEER",
             "POLARIS",
             "PREMIANT",
             "PRIDE OF RINGWOOD",
             "PROGRESS",
             "RAKAU",
             "RIWAKA",
             "SAAZ(CZECH REPUBLIC)",
             "SANTIAM",
             "SAPHIR",
             "SAVINJSKI GOLDING",
             "SELECT",
             "PACIFICA",
             "SIMCOE®(BRAND YCR 14)",
             "SMARAGD",
             "SORACHI ACE",
             "SOUTHERN CROSS",
             "SOVEREIGN",
             "SPALT",
             "STERLING",
             "STRISSELSPALT",
             "SUMMER",
             "SUMMIT™",
             "SUPER PRIDE",
             "SUSSEX",
             "SYLVA",
             "TAHOMA",
             "TARGET",
             "TETTNANG(UNITED STATES)",
             "TETTNANG(GERMANY)",
             "TOMAHAWK®(BRAND F10 CV.)",
             "TRADITION",
             "TRIPLEPEARL",
             "TRISKEL",
             "ULTRA",
             "VANGUARD",
             "WAI-ITI",
             "WAIMEA",
             "WAKATU",
             "WARRIOR®(BRAND YCR 5)",
             "WHITEBREAD GOLDING",
             "WILLAMETTE",
             "ZEUS",
             "ZYTHOS®"
           ];
    Util.responseHandler(res, true, "Success", hopsTypes);
})

router.get('/yeastTypes', (req, res) => {
    var yeastTypes = [
            "1007 - German Ale",
            "1010 - American Wheat",
            "1026-PC - British Cask Ale",
            "1028 - London Ale",
            "1056 - American Ale",
            "1084 - Irish Ale",
            "1087-PC - Wyeast Bohemian Ale Blend",
            "1098 - British Ale",
            "1099 - Whitbread Ale",
            "1187 - Ringwood Ale",
            "1203-PC - Burton IPA Blend",
            "1214 - Belgian Abbey Style Ale",
            "1217-PC - West Coast IPA",
            "1272 - American Ale II",
            "1275 - Thames Valley Ale",
            "1318 - London Ale III",
            "1332 - Northwest Ale",
            "1335 - British Ale II",
            "1388 - Belgian Strong Ale",
            "1450 - Denny's Favorite 50 Ale",
            "1469 - West Yorkshire Ale",
            "1581-PC - Belgian Stout",
            "1728 - Scottish Ale",
            "1762 - Belgian Abbey Style Ale II",
            "1768-PC - English Special Bitter",
            "1882-PC - Thames Valley Ale II",
            "1968 - London ESB Ale",
            "2000-PC - Budvar Lager",
            "2001-PC - Pilsner Urquell H-Strain",
            "2002-PC - Gambrinus Lager",
            "2007 - Pilsen Lager",
            "2035-PC - American Lager",
            "2042-PC - Danish Lager",
            "2105-PC - Rocky Mountain Lager",
            "2112 - California Lager",
            "2124 - Bohemian Lager",
            "2206 - Bavarian Lager",
            "2247-PC - European Lager",
            "2272-PC - North American Lager",
            "2278 - Czech Pils",
            "2308 - Munich Lager",
            "2352-PC - Munich Lager II",
            "2487-PC - Hella Bock Lager",
            "2565 - Kölsch",
            "2575-PC - Kolsch Yeast II",
            "2633 - Octoberfest Lager Blend",
            "2782-PC - Staro Prague Lager",
            "3031-PC - Saison-Brett Blend",
            "3056 - Bavarian Wheat Blend",
            "3068 - Weihenstephan Weizen",
            "3191-PC - Berliner Weisse Blend",
            "3209-PC - Oud Bruin Ale Blend",
            "3278 - Belgian Lambic Blend",
            "3333-PC - German Wheat",
            "3463-PC - Forbidden Fruit",
            "3522 - Belgian Ardennes",
            "3538-PC - Leuven Pale Ale",
            "3638 - Bavarian Wheat",
            "3655-PC - Belgian Schelde Ale",
            "3711 - French Saison",
            "3724 - Belgian Saison",
            "3725-PC - Bière de Garde",
            "3726 - Farmhouse Ale",
            "3739-PC - Flanders Golden Ale",
            "3763 - Roeselare Ale Blend",
            "3787 - Trappist Style High Gravity",
            "3789-PC - Trappist Style Blend",
            "3822-PC - Belgian Dark Ale",
            "3864-PC - Canadian/Belgian Ale",
            "3942-PC - Belgian Wheat",
            "3944 - Belgian Witbier",
            "9097-PC - Old Ale Blend"
        ];
    Util.responseHandler(res, true, "Success", yeastTypes);
})

router.get('/grainTypes', (req, res) => {
    var grainTypes = [
            "Acid Malt",
            "Amber Dry Extract",
            "Amber Liquid Extract",
            "Amber Malt",
            "Aromatic Malt",
            "Barley Hulls",
            "Barley, Flaked",
            "Barley, Raw",
            "Barley, Torrefied",
            "Biscuit Malt",
            "Black (Patent) Malt",
            "Black Barley (Stout)",
            "Brown Malt",
            "Brown Sugar, Dark",
            "Brown Sugar, Light",
            "Brumalt",
            "Candi Sugar, Amber",
            "Candi Sugar, Clear",
            "Candi Sugar, Dark",
            "Cane (Beet) Sugar",
            "Cara-Pils/Dextrine",
            "Caraamber",
            "Carafoam",
            "Caramel/Crystal Malt – 10L",
            "Caramel/Crystal Malt – 20L",
            "Caramel/Crystal Malt – 30L",
            "Caramel/Crystal Malt – 40L",
            "Caramel/Crystal Malt – 60L",
            "Caramel/Crystal Malt – 80L",
            "Caramel/Crystal Malt -120L",
            "Caramunich Malt",
            "Carared",
            "Caravienne Malt",
            "Chocolate Malt",
            "Chocolate Malt",
            "Corn Sugar (Dextrose)",
            "Corn Syrup",
            "Corn, Flaked",
            "Dark Dry Extract",
            "Dark Liquid Extract",
            "Dememera Sugar",
            "Extra Light Dry Extract",
            "Grits",
            "Honey",
            "Invert Sugar",
            "Light Dry Extract",
            "Maple Syrup",
            "Melanoiden Malt",
            "Mild Malt",
            "Milk Sugar (Lactose)",
            "Molasses",
            "Munich Malt",
            "Munich Malt – 10L",
            "Munich Malt – 20L",
            "Oats, Flaked",
            "Oats, Malted",
            "Pale Liquid Extract",
            "Pale Malt (2 Row) Bel",
            "Pale Malt (2 Row) UK",
            "Pale Malt (2 Row) US",
            "Pale Malt (6 Row) US",
            "Peat Smoked Malt",
            "Pilsner (2 Row) Bel",
            "Pilsner (2 Row) Ger",
            "Pilsner (2 Row) UK",
            "Pilsner Liquid Extract",
            "Rice Extract Syrup",
            "Rice Hulls",
            "Rice, Flaked",
            "Roasted Barley",
            "Rye Malt",
            "Rye, Flaked",
            "Smoked Malt",
            "Special B Malt",
            "Special Roast",
            "Sugar, Table (Sucrose)",
            "Toasted Malt",
            "Turbinado",
            "Victory Malt",
            "Vienna Malt",
            "Wheat Dry Extract",
            "Wheat Liquid Extract",
            "Wheat Malt, Bel",
            "Wheat Malt, Dark",
            "Wheat Malt, Ger",
            "Wheat, Flaked",
            "Wheat, Roasted",
            "Wheat, Torrified",
            "White Wheat Malt"
        ];
    Util.responseHandler(res, true, "Success", grainTypes);
})

module.exports = router;