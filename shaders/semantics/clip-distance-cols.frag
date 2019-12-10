struct VSOut
{
	float2 clip : SV_ClipDistance;
};

float4 main(VSOut vin) : SV_Target
{
	return vin.clip.xyyx;
}
