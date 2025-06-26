use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Clone, Debug)]
pub struct MapPoint {
    pub id: Uuid,
    pub lat: f64,
    pub lng: f64,
    pub description: String,
    pub updated_at: DateTime<Utc>,
}

impl MapPoint {
    pub fn new(lat: f64, lng: f64, description: String) -> Self {
        Self {
            id: Uuid::new_v4(),
            lat,
            lng,
            description,
            updated_at: Utc::now(),
        }
    }
    
    pub fn update_timestamp(&mut self) {
        self.updated_at = Utc::now();
    }
} 