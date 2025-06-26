use leptos::prelude::*;
use reactive_stores::Store;
use crate::components::{Map, PointManager, MapPoint};

#[derive(Clone, Debug, Default, Store)]
pub struct GlobalState {
    pub points_list: Vec<MapPoint>,
    pub current_point: Option<MapPoint>,
}

#[component]
pub fn App() -> impl IntoView {
    let points_list: Vec<MapPoint> = vec![
        MapPoint::new(50.05679, 6.02565, "BASE 1".to_string()),
        MapPoint::new(49.61098, 6.13353, "BASE 2".to_string()),
    ];
    provide_context(Store::new(GlobalState{
        points_list,
        current_point: None,
    }));
    
    mount_to_body(|| {
        view! {
            <div class="flex flex-row gap-4 p-4">
                <div class="w-80">
                    <PointManager/>
                </div>
                <div class="flex-1">
                    <Map/>
                </div>
            </div>
        }
    })
}