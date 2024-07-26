function parseString(text: string) {
    const parsedString = JSON.parse(text.replace(/\\n/g, ''))
    return parsedString
}

export default parseString