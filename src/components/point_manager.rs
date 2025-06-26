use leptos::prelude::*;
use reactive_stores::Store;
use crate::components::{GlobalState, point_actions::PointActions, point_form::PointForm, point_list::PointList};
use uuid::Uuid;

#[component]
pub fn PointManager() -> impl IntoView {
    let (is_editing, set_is_editing) = signal(false);
    let (editing_id, set_editing_id) = signal(Option::<Uuid>::None);
    
    let store = use_context::<Store<GlobalState>>().expect("GlobalState not found");
    let actions = PointActions::new(store);

    view! {
        <div class="p-4 bg-white rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-4">
                {move || if is_editing.get() { "Edit Point" } else { "Add Point to Map" }}
            </h3>
            
            <PointForm
                actions=actions.clone()
                is_editing=Signal::derive(move || is_editing.get())
                editing_id=Signal::derive(move || editing_id.get())
                set_is_editing=set_is_editing
                set_editing_id=set_editing_id
            />
            
            <PointList
                actions=actions
                set_is_editing=set_is_editing
                set_editing_id=set_editing_id
            />
        </div>
    }
} 