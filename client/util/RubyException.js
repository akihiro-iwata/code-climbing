class RubyException {
  DELIMITER = '\n'
  // prettier-ignore
  messageTable = {
    'unterminated string meets end of file': `どこかにダブルクォーテーション(")かシングルクォーテーション(\')で閉じられてない文字列があります。
      ${this.DELIMITER} 文字列は、シングル（'）かダブル（"）のクオートで囲む必要があります。`,
    'unexpected token $end': `\`end\`で閉じられていない制御句があります。${this.DELIMITER}if,for,while句はend句で閉じる必要があります。`,
    'unexpected token kEND': `if,for,while句の数と比べて、\`end\`の数が多すぎます。`
  }

  constructor(error, code) {
    this.errorName = error.name
    this.errorMessage = error.message
    this.code = code
  }

  message() {
    // prettier-ignore
    if (this.errorName !== 'SyntaxError'　|| !this.messageTable[this.errorMessage]) return this.errorMessage
    return ['【エラー: 文法誤り】', this.messageTable[this.errorMessage]]
  }
}

export default RubyException
