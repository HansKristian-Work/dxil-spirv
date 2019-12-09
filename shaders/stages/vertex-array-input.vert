struct VSIn
{
	float4 v4[4] : ATTR0;
	float v1[4] : ATTR4;
};

float4 main(VSIn v) : SV_Position
{
	return (v.v4[0] + v.v4[3]) + (v.v1[1] + v.v1[2]);
};
