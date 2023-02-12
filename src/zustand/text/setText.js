export default (set) => ({
    setTextTexts: (texts) =>
        set((state) => ({
            ...state,
            text: {
                ...state.text,
                texts,
            },
        })),
    addTextTexts: (texts) =>
        set((state) => ({
            ...state,
            text: {
                ...state.text,
                // TODO make this a Set()
                texts: [...state.text.texts, ...texts],
            },
        })),
    updateTextTexts: (key, variables) =>
        set((state) => ({
            ...state,
            text: {
                ...state.text,
                texts:
                    state.text.texts.map((text) => {
                        if (text.key === key) {
                            return {
                                ...text,
                                variables,
                            };
                        }

                        return text;
                    })
                ,
            },
        })),
    removeTextTexts: (key) =>
        set((state) => ({
            ...state,
            text: {
                ...state.text,
                texts: state.text.texts.filter((text) => text.key !== key),
            },
        })),
});
