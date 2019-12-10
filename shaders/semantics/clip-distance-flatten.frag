struct VSOut
{
	float2 clip[2] : SV_ClipDistance;
};

float4 main(VSOut vin) : SV_Target
{
	return float4(vin.clip[0], vin.clip[1]);
}
