function setPointer (num: number) {
    pins.i2cWriteNumber(
    ADCaddress,
    num,
    NumberFormat.Int8LE,
    false
    )
}
// CONFIG Bit fields: 15 = OS 14:12 = MUX 11:9 = PGA 8 = MODE
function readCONVERSION () {
    return pins.i2cReadNumber(ADCaddress, NumberFormat.UInt16BE, false)
}
function startConversion (num: number) {
    // Write CONFIG reg address
    pins.i2cWriteNumber(
    ADCaddress,
    CONFIG,
    NumberFormat.UInt8LE,
    true
    )
    // Write num to CONFIG reg
    pins.i2cWriteNumber(
    ADCaddress,
    configValue,
    NumberFormat.UInt16BE,
    false
    )
}
let result = 0
let busy = false
let configValue = 0
let CONFIG = 0
let ADCaddress = 0
let CONVERSION = 0
// slave address
ADCaddress = 144
// Register 0
// Register 1
CONFIG = 1
// Bit field OS set to 1 starts conversion
let OS = 1
// Bit field MUX sets the ADC input channel: 100 = AIN0 single-ended
let MUX = 4
// Bit field: Gain = +/- 2.048V
let PGA = 2
// Bit field: Mode = single shot
let MODE = 1
// Bit field DIS = 3 disables comparator
let DIS = 3
configValue = BitwiseLogic.bitwise2arg(OS, operator.leftShift, 15)
configValue = BitwiseLogic.bitwise2arg(configValue, operator.or, BitwiseLogic.bitwise2arg(MUX, operator.leftShift, 12))
configValue = BitwiseLogic.bitwise2arg(configValue, operator.or, BitwiseLogic.bitwise2arg(PGA, operator.leftShift, 9))
configValue = BitwiseLogic.bitwise2arg(configValue, operator.or, BitwiseLogic.bitwise2arg(MODE, operator.leftShift, 8))
configValue = BitwiseLogic.bitwise2arg(configValue, operator.or, BitwiseLogic.bitwise2arg(DIS, operator.leftShift, 0))
loops.everyInterval(1000, function () {
    // Start ADC conversion (OS => 1)
    startConversion(configValue)
    busy = true
    // Read status until conversion done
    while (busy) {
        busy = BitwiseLogic.bitwise2arg(readCONVERSION(), operator.rightShift, 15) == 1
    }
    // Set pointer to read result
    setPointer(0)
    result = readCONVERSION()
})
