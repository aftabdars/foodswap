

export function SerializeImage(image, name) {
    const extension = typeof(image) === 'string'? image.split('.').pop() : image.assets[0].uri.split('.').pop();
    return {
        uri: typeof(image) === 'string'? image : image.assets[0].uri,
        type: `image/${extension}`,
        name: name? `${name.replace(' ', '-')}.${extension}` : `photo.${extension}`,
      }
}