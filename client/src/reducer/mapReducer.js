export default function mapReducer(state, { type, payload }) {

    switch (type) {
        case 'CREATE_DRAFT':
            return {
                ...state,
                draft: {
                    latitude: 0,
                    longitude: 0,
                },
            };
        case 'UPDATE_DRAFT_LOCATION':
            return {
                ...state,
                draft: payload,
            };
        case 'DELETE_DRAFT':
            return {
                ...state,
                draft: null,
            };
        case 'GET_PINS':
            return {
                ...state,
                pins: payload,
            };
        case 'CREATE_PIN':
            const newPin = payload;
            const prevPins = state.pins.filter(pin => pin._id !== newPin._id);
            return {
                ...state,
                pins: [...prevPins, newPin],
            };
        default:
            return state;
    }
}
