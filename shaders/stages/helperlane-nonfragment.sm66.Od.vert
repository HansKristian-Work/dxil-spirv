float4 main() : SV_Position
{
	return IsHelperLane() ? 1.0 : 0.0;
}
