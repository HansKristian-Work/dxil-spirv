static const float LUT[4] = { 1, 2, 3, 4 };
static float NonLUT[4] = { 5, 6, 7, 8 };

float4 main(uint vid : SV_VertexID, uint iid : SV_InstanceID, uint4 a : A) : SV_Position
{
	float arr[4] = (float[4])0;

	arr[a.x] = vid;
	NonLUT[a.y] = iid;

	for (uint i = 0; i < a.w; i++, arr[i] += 50)
	{
		NonLUT[i ^ 2] += 60;
	}

	return float4(LUT[a.z], NonLUT[a.w], arr[a.x], 1.0); 
}

