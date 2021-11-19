/**
 * @param scene
 * @param assetKey
 * @param animationName
 * @param frameQuantity
 */
// eslint-disable-next-line import/prefer-default-export
export const createWalkingAnimation = (
    scene,
    assetKey,
    animationName,
    frameQuantity
) => {
    scene.anims.create({
        key: `${assetKey}_${animationName}`,
        frames: Array.from({ length: frameQuantity }).map((n, index) => ({
            key: assetKey,
            frame: `${animationName}_${(index + 1).toString().padStart(2, '0')}`,
        })),
        frameRate: 4,
        repeat: -1,
        yoyo: true,
    });
};
