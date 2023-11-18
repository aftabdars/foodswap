

export function SerializeImage(image, name) {
    const extension = image.uri.split('.').pop();
    return {
        uri: image.uri,
        type: `image/${extension}`,
        name: name? `${name.replace(' ', '-')}.${extension}` : `photo.${extension}`,
      }
}