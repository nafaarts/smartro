import { View } from "react-native"
import { Button } from "react-native-paper"

export default function ButtonFlex({
  mode,
  title,
  icon,
  onPress,
  color,
  disabled,
  ...props
}) {
  return (
    <View {...props}>
      <Button
        mode={mode}
        onPress={onPress}
        icon={icon}
        style={{
          borderRadius: 5,
          borderWidth: 1,
          borderColor: color,
        }}
        disabled={disabled}
        buttonColor={mode === "contained" ? color : "#fff"}
        textColor={mode === "contained" ? "#fff" : color}
      >
        {title}
      </Button>
    </View>
  )
}
