global.MIN_TIME_CHANGE_CURRENT_STATE = 4 * 1000; //in miliseconds
global.TIME_TO_CONFIRM_CHANGE_STATE = 2 * 1000;
global.TIME_REFRESH_PROGRESS_NEXT_CARD = 300;
global.TAP_TIME = 1300;
global.NUM_DISPLAYED_CHARS_LISTING_TEXT = 82;
global.MAX_DISTANCE_PLACE_CURRENT_LOCATION_IN_MTS = 10000;
global.PLACE_DISTANCE_TO_SHOW_MAP = 1000;
global.MAX_PLACES_HOME = 10;
global.MAX_VELOCITY = 7; //km/h
global.MAX_VELOCITY_IPS = 5; //km/h
global.MAX_VELOCITY_METERS_PER_SECOND = 3;
global.AVG_VELOCITY_METERS_PER_SECOND = 1.3;
global.DEFAULT_LANGUAGE = "pt-br";
global.GPS_REUSE_MAX_AGE = 500; //ms
global.GPS_TIMEOUT = 1500;
global.MAX_WAIT_TIMEOUT = 35000;
global.MAX_WAIT_TOUR_TIMEOUT = 90000;
global.REFRESH_DISTANCE_TIME = 500;
global.NOTIFICATIONS_CLEAN_INTERVAL = 600000; //10 MINUTES
global.MAX_DISTANCE_FIND_PLACE_TOUR = 20; //20 METERS
global.TOUR_MAX_TIME_IGNORE_BEACONS = 5 * 1000; //5 SECONDS
global.MIN_TIME_SHOW_POPUP_WHEN_GO_TO = 20000; //20 SECONDS
global.MAX_INDOOR_ACCURACY = 10; //10m
global.MAX_TIME_INACTIVE_NAVIGATION = 1500; //in ms
global.ACCELEROMETER_FREQUENCY = 200; //in ms
global.COMPASS_FREQUENCY = 80; //in ms
global.PEDOMETER_FREQUENCY = 100; //in ms
global.METERS_TO_FEET = 3.28084;
global.STEP_SIZE = 0.5; //in meters
global.IS_WALKING_MAGNITUDE = 0.6;
global.GRAVITY = 9.8;
global.SHADOW_DEVIATION = -0.9;
global.PATH_LOSS = 2.4;
global.LIMIT_THRESHOLD = 3.3; //meters
global.WALKING_BEACON_AVG = 1100;
global.MAP_AUTOCLOSE_POPUP_TIMEOUT = 3350; //miliseconds
global.MIN_MT_ACCURACY = 2.2;
global.STOPPED_MIN_MT_ACCURACY = 1.2;
global.SAME_ADS_INTERVAL_TIME = 90000; //ms
global.TIME_UPDATE_POSITION_AFTER_STOP = 10000;
global.MONITORING_FENCE_INTERVAL = 1000; //ms
global.MAP_BETWEEN_TRANSITION_TIME = 60000; //ms
global.MAX_ITEMS_PER_PAGE = 15; //ms
global.REFRESH_METADATA_TIME = 5 * 60 * 1000; //ms
global.MAX_DISTANCE_CONSIDER = 20; //meters
global.MAX_TIME_CONSIDER_PLACE_LIST_LOCATION_CACHE = 60 * 5 * 1000; //ms

if(Number.MAX_SAFE_INTEGER==null){
  Number.MAX_SAFE_INTEGER = 9007199254740991;
}

if(Number.MIN_SAFE_INTEGER==null){
  Number.MIN_SAFE_INTEGER = -9007199254740991;
}
