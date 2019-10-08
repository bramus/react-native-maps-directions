#import "MapViewDirections.h"

#import <MapKit/MapKit.h>
#import <QuartzCore/QuartzCore.h>

@implementation MapViewDirections

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(getDirections,
                 origin:(CLLocationCoordinate2D)origin
                 destination:(CLLocationCoordinate2D)destination
                 getDirectionsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  MKDirectionsRequest *request = [[MKDirectionsRequest alloc] init];
  MKPlacemark *placemarkOrigin = nil;
  // NOTE: iOS 10 v iOS 3-9 deprecated function
  //   https://stackoverflow.com/questions/41486370/crash-on-ios-9-only-mkplacemark-initwithcoordinate-unrecognized-selector
  if ([MKPlacemark respondsToSelector:@selector(initWithCoordinate:)]) {
    placemarkOrigin = [[MKPlacemark alloc] initWithCoordinate:origin];
  } else {
    placemarkOrigin = [[MKPlacemark alloc] initWithCoordinate:origin addressDictionary:nil];
  }
  MKMapItem *mapItemOrigin = [[MKMapItem alloc] initWithPlacemark:placemarkOrigin];
  [request setSource:mapItemOrigin];
  MKPlacemark *placemarkDestination = nil;
  if ([MKPlacemark respondsToSelector:@selector(initWithCoordinate:)]) {
    placemarkDestination = [[MKPlacemark alloc] initWithCoordinate:destination];
  } else {
    placemarkDestination = [[MKPlacemark alloc] initWithCoordinate:destination addressDictionary:nil];
  }
  MKMapItem *mapItemDestination = [[MKMapItem alloc] initWithPlacemark:placemarkDestination];
  [request setDestination:mapItemDestination];
  [request setTransportType:MKDirectionsTransportTypeAny]; // This can be limited to automobile and walking directions.
  [request setRequestsAlternateRoutes:YES]; // Gives you several route options.
  MKDirections *directions = [[MKDirections alloc] initWithRequest:request];
  [directions calculateDirectionsWithCompletionHandler:^(MKDirectionsResponse *response, NSError *error) {
    if (error) {
      reject(@"no_directions", @"There were no directions", error);
    } else {
      NSMutableArray* routes = [[NSMutableArray alloc] init];
      for (MKRoute *route in [response routes]) {
        // route is the MKRoute in this example
        // but the polyline can be any MKPolyline
        NSUInteger pointCount = route.polyline.pointCount;
        // allocate a C array to hold this many points/coordinates...
        CLLocationCoordinate2D *routeCoordinates
        = malloc(pointCount * sizeof(CLLocationCoordinate2D));
        // get the coordinates (all of them)...
        [route.polyline getCoordinates:routeCoordinates
                                 range:NSMakeRange(0, pointCount)];
        // this part just shows how to use the results...
        // NSLog(@"route pointCount = %d", pointCount);
        NSMutableArray* points = [[NSMutableArray alloc] init];
        for (int c = 0; c < pointCount; c++)
        {
          // NSLog(@"routeCoordinates[%d] = %f, %f", c, routeCoordinates[c].latitude, routeCoordinates[c].longitude);
          [points addObject:@[@(routeCoordinates[c].latitude), @(routeCoordinates[c].longitude)]];
        }
        [routes addObject:@{@"overview_polyline": @{@"points": points}}];
      }
      resolve(routes);
    }
  }];
}

@end
