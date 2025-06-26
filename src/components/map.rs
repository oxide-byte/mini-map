use leptos::logging::log;
use leptos::prelude::*;
use leptos_leaflet::prelude::*;
use reactive_stores::Store;
use crate::components::{GlobalState, MapPoint};

#[component]
pub fn Map() -> impl IntoView {
    let store = use_context::<Store<GlobalState>>().expect("GlobalState not found");
    let mut events = MapEvents::new();

    events = events.mouse_click(move |m| {
        let lat_lng = m.lat_lng();
        log!("{:?}", lat_lng);
        store.update(|state| {
            state.current_point = Some(MapPoint::new(
                lat_lng.lat(),
                lat_lng.lng(),
                String::new(),
            ));
        });
    });

    view! {
          <MapContainer style="height: 700px" center=Position::new(49.74250, 6.10000) zoom=8.0 set_view=true events>
              <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"/>

            <For
                each=move || store.get().points_list
                key=|point| (point.id, point.updated_at)
                children=move |point| {
                    view! {
                        <Marker position=position!(point.lat, point.lng)>
                            <Popup>
                                <strong>{point.description}</strong>
                            </Popup>
                        </Marker>
                    }
                }
            />

        </MapContainer>
    }
}