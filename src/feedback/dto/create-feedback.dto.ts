import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {

  @ApiProperty({
    example: 5,
    description: 'Rating from 1 to 5'
  })
  rating: number;


  @ApiProperty({
    example: "Excellent food and service!",
    required: false
  })
  comment?: string;
}