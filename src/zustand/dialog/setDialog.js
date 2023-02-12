export default (set) => ({
    setDialogMessages: (messages) =>
        set((state) => ({
            ...state,
            dialog: {
                ...state.dialog,
                messages,
            },
        })),
    setDialogAction: (action) =>
        set((state) => ({
            ...state,
            dialog: {
                ...state.dialog,
                action,
            },
        })),
    setDialogCharacterName: (characterName) =>
        set((state) => ({
            ...state,
            dialog: {
                ...state.dialog,
                characterName,
            },
        })),
});
