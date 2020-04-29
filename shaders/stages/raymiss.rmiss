struct Payload
{
	float4 color;
};

[shader("miss")]
void RayMiss(inout Payload payload)
{
	payload.color = float4(1.0, 2.0, 3.0, 4.0);
}

