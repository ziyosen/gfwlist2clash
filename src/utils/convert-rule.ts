export const convertRule = (source: string, groupName: string) => {
  const worker = (input: string) => {
    const res: string[] = []
    const storage: Record<string, string[]> = {
      suffix: [],
      full: [],
      keyword: [],
    }

    const lines = input.split(/\r?\n/)
    for (let rule of lines) {
      if (/^(\s*$|!|\[)/.test(rule)) {
        continue
      }

      if (rule.startsWith('/')) {
        continue
      }

      if (rule.startsWith('@@')) {
        continue
      }

      let pattern: RegExpMatchArray | null

      // Discard scheme
      rule = rule.replace(/https?:\/\//, '')

      // Discard path
      rule = rule.replace(/\/.*/, '')

      if ((pattern = rule.match(/^(.*\*[^.]*\.|\|\|)(.+)$/)) !== null) {
        storage.suffix.push(pattern[2])
        continue
      }

      if ((pattern = rule.match(/^\|(.+\.[a-zA-Z].+)$/)) !== null) {
        storage.full.push(pattern[1])
        continue
      }

      if ((pattern = rule.match(/^(?=.*\.[a-zA-Z])[a-zA-Z0-9.-]+$/)) !== null) {
        storage.keyword.push(pattern[0])
      }
    }

    for (const key in storage) {
      storage[key] = [...new Set(storage[key])]
    }

    // Remove keyword rules similar to suffix rules
    storage.keyword = storage.keyword.filter((pattern) => {
      return !storage.suffix.some((s) => pattern.endsWith(s))
    })

    storage.full = storage.full.filter((pattern) => {
      return (
        !storage.suffix.some((s) => pattern.endsWith(s)) ||
        !storage.keyword.some((s) => pattern.includes(s))
      )
    })

    for (const pattern of storage.full) {
      res.push(`DOMAIN,${pattern},${groupName}`)
    }

    for (const pattern of storage.suffix) {
      res.push(`DOMAIN-SUFFIX,${pattern},${groupName}`)
    }

    for (const pattern of storage.keyword) {
      res.push(`DOMAIN-KEYWORD,${pattern},${groupName}`)
    }
    return res
  }

  const invalidCharsRegex = /[^a-zA-Z0-9+/=\s]/

  if (!invalidCharsRegex.test(source)) {
    const decodedInput = atob(source)
    return worker(decodedInput)
  } else {
    return worker(source)
  }
}
