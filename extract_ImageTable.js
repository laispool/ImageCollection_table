// Create the geometry. You can use this website to do so: https://geojson.io/#map=2/20.0/0.0 

// You can change the final data to match the present day

var geometry = ee.Geometry.Polygon(
          [[[-48.81397247314453,-26.3201906569428],
            [-48.71440887451172,-26.3201906569428],
            [-48.71440887451172,-26.211202857836913],
            [-48.81397247314453,-26.211202857836913],
            [-48.81397247314453,-26.3201906569428]]]);
Map.centerObject(geometry, 11);

//Create function to set the data type/format

var organize_data = function (image) {
  return image.copyProperties(image,image.propertyNames())
  .set({data: image.date().format('YYYY-MM-dd')});
};

// Creating the collections with filters

var L5coll = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2') // Landsat 5  - Surface Reflectance
  .filter(ee.Filter.lt('CLOUD_COVER',20))//20% max of cloud cover
  .select(['SR_B4', 'SR_B3', 'SR_B2', 'SR_B1']) // true color + NIR
  .filterDate('1984-03-16', '2012-05-05') // available date 
  .filterBounds(geometry).map(function(image){return image})
  .map(organize_data); //apply the function
  
  var lista_l5 = L5coll.aggregate_array('data');
  print('Lista de datas da coleção Landsat 5:',lista_l5);
  print(L5coll);


var L7coll = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2') // Landsat 7 - Surface Reflectance
  .filter(ee.Filter.lt('CLOUD_COVER',20)) //20% max of cloud cover
  .select(['SR_B4','SR_B3', 'SR_B2', 'SR_B1'])// true color + NIR
  .filterDate('1999-05-28', '2022-08-01') // available date
  .filterBounds(geometry)
  .map(function(image){return image})
  .map(organize_data);
  
  var lista_l7 = L7coll.aggregate_array('data');
  print('Lista de datas da coleção Landsat 7:',lista_l7);
  print(L7coll); ; 

var L8coll = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') // Landsat 8 - Surface Reflectance
  .filter(ee.Filter.lt('CLOUD_COVER',20))//20% max of cloud cover
  .filterDate('2013-03-18', '2022-08-19') // available date
  .filterBounds(geometry)
  .select(['SR_B5','SR_B4', 'SR_B3', 'SR_B2']);// true color + NIR
  .map(function(image){return image})
  .map(organize_data);

  var lista_l8 = L8coll.aggregate_array('data');
  print('Lista de datas da coleção Landsat 8:',lista_l8);
  print(L8coll);  
  
var L9coll = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2') // Landsat 9 - Surface Reflectance
  .filter(ee.Filter.lt('CLOUD_COVER',20)) //20% max of cloud cover
  .filterDate('2021-10-31', '2022-08-24') // available date
  .filterBounds(geometry)
  .select(['SR_B5','SR_B4', 'SR_B3', 'SR_B2']);// true color + NIR
  .map(function(image){return image})
  .map(organize_data);

  var lista_l9 = L9coll.aggregate_array('data');
  print('Lista de datas da coleção Landsat 9:',lista_l9);
  print(L9coll); 
  
var S2coll = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') // Sentinel 2 - Surface Reflectance
  .filter(ee.Filter.lt('CLOUD_COVERAGE_ASSESSMENT',20)) //20% max of cloud cover
  .filterDate('2017-03-28', '2022-08-31') // available date
  .filterBounds(geometry)
  .select(['B8','B4', 'B3', 'B2']);// true color + NIR
  .map(function(image){return image})
  .map(organize_data);
  
  var lista_s2 = S2coll.aggregate_array('data');
  print('Lista de datas da coleção Sentinel 2:',lista_s2);
  print(S2coll);  
  
// Merge the four image collections (Landsat).
var icMerged = L5coll.merge(L7coll).merge(L8coll).merge(L9coll);

// Export the image sample feature collection to Drive as a CSV file.
Export.table.toDrive({
  collection: icMerged,
  description: 'LandsatCollection',
});
// Export the image sample feature collection to Drive as a CSV file.
Export.table.toDrive({
  collection: S2coll,
  description: 'SentinelCollection',
});
