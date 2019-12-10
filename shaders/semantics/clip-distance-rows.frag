struct VSOut
{
	float clip[2] : SV_ClipDistance;
};

float4 main(VSOut vin) : SV_Target
{
	return float4(vin.clip[0].xx, vin.clip[1].xx);
}
