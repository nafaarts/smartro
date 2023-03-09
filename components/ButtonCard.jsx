import { MaterialCommunityIcons } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native"
import { Card, Text } from "react-native-paper"

export default function ButtonCard({
  title,
  icon,
  color,
  onPress,
  children,
  ...props
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card mode="contained" {...props}>
        <Card.Content style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={color}
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: color }}>{title}</Text>
          {children}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  )
}
