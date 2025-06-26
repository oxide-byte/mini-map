use leptos::logging::log;
use leptos::prelude::*;
use reactive_stores::Store;
use crate::components::{GlobalState, types::MapPoint};
use uuid::Uuid;

#[derive(Clone)]
pub struct PointActions {
    store: Store<GlobalState>,
}

impl PointActions {
    pub fn new(store: Store<GlobalState>) -> Self {
        Self { store }
    }

    pub fn add_point(&self, lat: f64, lng: f64, description: String) {
        let new_point = MapPoint::new(lat, lng, description);
        self.store.update(|state| state.points_list.push(new_point));
        self.clear_current_point();
    }

    pub fn update_point(&self, id: Uuid, lat: f64, lng: f64, description: String) {
        log!("update_point {:?}", description);
        self.store.update(|state| {
            if let Some(point) = state.points_list.iter_mut().find(|p| p.id == id) {
                point.lat = lat;
                point.lng = lng;
                point.description = description;
                point.update_timestamp();
            }
        });
        self.clear_current_point();
    }

    pub fn delete_point(&self, id: Uuid) {
        self.store.update(|state| {
            state.points_list.retain(|p| p.id != id);
        });
    }

    pub fn set_current_point(&self, point: MapPoint) {
        self.store.update(|state| {
            state.current_point = Some(point);
        });
    }

    pub fn update_current_point_lat(&self, lat: f64) {
        self.store.update(|state| {
            if let Some(ref mut point) = state.current_point {
                point.lat = lat;
                point.update_timestamp();
            } else {
                state.current_point = Some(MapPoint::new(lat, 0.0, String::new()));
            }
        });
    }

    pub fn update_current_point_lng(&self, lng: f64) {
        self.store.update(|state| {
            if let Some(ref mut point) = state.current_point {
                point.lng = lng;
                point.update_timestamp();
            } else {
                state.current_point = Some(MapPoint::new(0.0, lng, String::new()));
            }
        });
    }

    pub fn update_current_point_description(&self, description: String) {
        self.store.update(|state| {
            if let Some(ref mut point) = state.current_point {
                point.description = description;
                point.update_timestamp();
            }
        });
    }

    pub fn clear_current_point(&self) {
        self.store.update(|state| {
            state.current_point = None;
        });
    }

    pub fn get_current_point(&self) -> Option<MapPoint> {
        self.store.get().current_point.clone()
    }

    pub fn get_points_list(&self) -> Vec<MapPoint> {
        self.store.get().points_list.clone()
    }
} 