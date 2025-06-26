use leptos::prelude::*;
use crate::components::{types::MapPoint, point_actions::PointActions};
use uuid::Uuid;

#[component]
pub fn PointList(
    #[prop(into)] actions: PointActions,
    #[prop(into)] set_is_editing: WriteSignal<bool>,
    #[prop(into)] set_editing_id: WriteSignal<Option<Uuid>>,
) -> impl IntoView {
    let edit_point = {
        let actions = actions.clone();
        move |point: MapPoint| {
            actions.set_current_point(point.clone());
            set_is_editing.set(true);
            set_editing_id.set(Some(point.id));
        }
    };

    let delete_point = {
        let actions = actions.clone();
        move |point_id: Uuid| {
            actions.delete_point(point_id);
        }
    };

    view! {
        <div class="mt-4">
            <h4 class="text-md font-medium mb-2">"Added Points"</h4>
            <div class="max-h-64 overflow-y-auto space-y-2 border border-gray-200 rounded-md p-2">
                <For
                    each=move || actions.get_points_list()
                    key=|point| (point.id, point.updated_at)
                    children=move |point| {
                        let point_id = point.id;
                        let edit_point_clone = edit_point.clone();
                        let point_clone = point.clone();
                        let delete_point_clone = delete_point.clone();
                        
                        view! {
                            <div class="p-2 bg-gray-50 rounded border">
                                <div class="flex-1">
                                    <div class="text-sm">
                                        <div>
                                        <span class="font-medium">"Lat: "</span>
                                        <span>{point.lat}</span>
                                        </div><div>
                                        <span class="font-medium">"Lng: "</span>
                                        <span>{point.lng}</span>
                                        </div>
                                    </div>
                                    <div class="text-sm text-gray-600 mt-1">
                                        {point.description}
                                    </div>
                                </div>
                                <div class="flex space-x-1 mt-2">
                                    <button
                                        class="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                        on:click=move |_| edit_point_clone(point_clone.clone())
                                    >
                                        "Edit"
                                    </button>
                                    <button
                                        class="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                        on:click=move |_| delete_point_clone(point_id)
                                    >
                                        "Delete"
                                    </button>
                                </div>
                            </div>
                        }
                    }
                />
            </div>
        </div>
    }
} 