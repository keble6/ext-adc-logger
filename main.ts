function setPointer (num: number) {
    pins.i2cWriteNumber(
    ADCaddress,
    num,
    NumberFormat.Int8LE,
    false
    )
}
// Read 2 bytes from either CONVERSION (Pointer = 0) or CONFIG (Pointer = 1)
function read () {
    return pins.i2cReadNumber(ADCaddress, NumberFormat.UInt16BE, false)
}
// Send:
// * 1 byte to set Pointer to CONFIG address (01)
// * then 2 bytes of configValue
function startConversion (num: number) {
    serial.writeLine("ADCaddress =" + ADCaddress)
    serial.writeLine("CONFIG = " + CONFIG)
    serial.writeLine("ConfigValue = " + configValue)
    // Write CONFIG reg address
    pins.i2cWriteNumber(
    ADCaddress,
    CONFIG,
    NumberFormat.Int8LE,
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
let temp = 0
let busy = false
let configValue = 0
let CONFIG = 0
let ADCaddress = 0
let CONVERSION = 0
// slave address 0b1001000
ADCaddress = 72
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
loops.everyInterval(10000, function () {
    serial.writeLine("configValue = " + configValue)
    // Start ADC conversion (OS => 1)
    startConversion(configValue)
    serial.writeLine("ReadConfigValue = " + read())
    busy = true
    // Read status until conversion done
    while (busy) {
        temp = read()
        busy = BitwiseLogic.bitwise2arg(temp, operator.rightShift, 15) == 0
        serial.writeLine("Read config = " + temp)
    }
    // Set pointer to read result
    setPointer(0)
    result = read()
    serial.writeLine("Read data = " + result)
    // Show top 8 bits
    result = BitwiseLogic.bitwise2arg(result, operator.and, 65280)
    result = BitwiseLogic.bitwise2arg(result, operator.rightShift, 8)
    basic.showNumber(result)
})
