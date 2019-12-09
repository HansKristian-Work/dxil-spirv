struct VSOut
{
	float4 pos : SV_Position;
	float4 v4[4] : ATTR0;
	float v1[4] : ATTR4;
};

VSOut main(float4 v : POSITION)
{
	VSOut vout;
	vout.pos = v;
	vout.v4[0] = v;
	vout.v4[1] = v + 1.0;
	vout.v4[2] = v + 2.0;
	vout.v4[3] = v + 3.0;
	vout.v1[0] = v.x;
	vout.v1[1] = v.y;
	vout.v1[2] = v.z;
	vout.v1[3] = v.w;
	return vout;
}
