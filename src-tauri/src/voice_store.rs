pub struct VoiceStore {
    data: Vec<Vec<u8>>
}

impl VoiceStore {
    pub fn new() -> Self {
        VoiceStore { data :vec![
                include_bytes!("../../resource/00_oftonp.wav").to_vec(),
                include_bytes!("../../resource/01_kana.wav").to_vec(),
                include_bytes!("../../resource/02_mana.wav").to_vec(),
                include_bytes!("../../resource/03_tsukuyomichan.wav").to_vec(),
                include_bytes!("../../resource/04_shikokumetan.wav").to_vec(),
                include_bytes!("../../resource/05_zundamon.wav").to_vec(),
            ]
        }
    }

    pub fn get_data(&self, index: usize) -> &Vec<u8> {
        return &self.data[index]
    }
}
