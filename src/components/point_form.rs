use leptos::prelude::*;
use crate::components::point_actions::PointActions;
use uuid::Uuid;

#[component]
pub fn PointForm(
    #[prop(into)] actions: PointActions,
    #[prop(into)] is_editing: Signal<bool>,
    #[prop(into)] editing_id: Signal<Option<Uuid>>,
    #[prop(into)] set_is_editing: WriteSignal<bool>,
    #[prop(into)] set_editing_id: WriteSignal<Option<Uuid>>,
) -> impl IntoView {
    let (description, set_description) = signal(String::new());

    // Update description when current point changes (for editing)
    let actions_effect = actions.clone();
    let set_description_clone = set_description.clone();
    Effect::new(move |_| {
        if let Some(current_point) = actions_effect.get_current_point() {
            // When we start editing, populate the description field
            if is_editing.get() {
                set_description_clone.set(current_point.description.clone());
            }
        }
    });

    let save_point = {
        let actions = actions.clone();
        move |_| {
            if let Some(current_point) = actions.get_current_point() {
                let description_value = description.get();
                if is_editing.get() {
                    if let Some(id) = editing_id.get() {
                        // Use the description from the signal, not from current_point
                        actions.update_point(id, current_point.lat, current_point.lng, description_value);
                        set_is_editing.set(false);
                        set_editing_id.set(None);
                    }
                } else {
                    // For new points, also use the description from the signal
                    actions.add_point(current_point.lat, current_point.lng, description_value);
                }
                set_description.set(String::new());
            }
        }
    };

    let cancel_edit = {
        let actions = actions.clone();
        move |_| {
            set_is_editing.set(false);
            set_editing_id.set(None);
            set_description.set(String::new());
            actions.clear_current_point();
        }
    };

    let update_description = {
        let actions = actions.clone();
        move |ev| {
            let value = event_target_value(&ev);
            set_description.set(value.clone());
            actions.update_current_point_description(value);
        }
    };

    let update_lat = {
        let actions = actions.clone();
        move |ev| {
            if let Ok(value) = event_target_value(&ev).parse::<f64>() {
                actions.update_current_point_lat(value);
            }
        }
    };

    let update_lng = {
        let actions = actions.clone();
        move |ev| {
            if let Ok(value) = event_target_value(&ev).parse::<f64>() {
                actions.update_current_point_lng(value);
            }
        }
    };

    let actions_lat = actions.clone();
    let actions_lng = actions.clone();
    let actions_desc = actions.clone();

    view! {
        <div class="space-y-3">
            <div>
                <label class="block text-sm font-medium text-gray-700">"Latitude"</label>
                <input
                    type="number"
                    step="any"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    prop:value=move || actions_lat.get_current_point().map(|p| p.lat).unwrap_or(0.0)
                    on:input=update_lat
                />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">"Longitude"</label>
                <input
                    type="number"
                    step="any"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    prop:value=move || actions_lng.get_current_point().map(|p| p.lng).unwrap_or(0.0)
                    on:input=update_lng
                />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">"Description"</label>
                <input
                    type="text"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    prop:value=move || {
                        // Use description signal, but fall back to current point description if signal is empty
                        let desc = description.get();
                        if desc.is_empty() {
                            actions_desc.get_current_point().map(|p| p.description).unwrap_or_default()
                        } else {
                            desc
                        }
                    }
                    on:input=update_description
                />
            </div>
            <div class="flex space-x-2">
                <button
                    class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    on:click=save_point
                >
                    {move || if is_editing.get() { "Save Changes" } else { "Add Point" }}
                </button>
                <Show
                    when=move || is_editing.get()
                    fallback=|| ()
                >
                    <button
                        class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        on:click=cancel_edit.clone()
                    >
                        "Cancel"
                    </button>
                </Show>
            </div>
        </div>
    }
} 