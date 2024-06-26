USE [Resolvely]
GO
/****** Object:  StoredProcedure [dbo].[Comments_Insert]    Script Date: 2/7/2024 9:27:11 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Author:	Kendall Stephens
-- Create date: 1/31/2023
-- Description: Insert New Comments 
-- Code Reviewer: Aurel Aliy

-- MODIFIED BY:  
-- MODIFIED DATE: 
-- Code Reviewer: 
-- =============================================

CREATE proc [dbo].[Comments_Insert]
			@Subject nvarchar(50),
			@Text nvarchar(3000),
			@ParentId int,
			@EntityTypeId int,
			@EntityId int,
			@CreatedBy int,
			@Id int OUTPUT
			
as
/*
DECLARE @Id int = 0;
DECLARE @Subject nvarchar(50) = 'Test Comment'
	   ,@Text nvarchar(3000) = 'Toy for Tots brings smiles to childrens faces'
	   ,@ParentId int = 19
	   ,@EntityTypeId int = 2
	   ,@EntityId int = 21
	   ,@CreatedBy int = 8

EXECUTE dbo.Comments_Insert
		@Subject
	   ,@Text
	   ,@ParentId
	   ,@EntityTypeId
	   ,@EntityId
	   ,@CreatedBy
	   ,@Id

	
*/

BEGIN

DECLARE @IsDeleted bit= 0

INSERT INTO [dbo].[Comments]
			([Subject],
			 [Text],
			 [ParentId],
			 [EntityTypeId],
			 [EntityId],
			 [CreatedBy],
			 [IsDeleted])
		VALUES
			(@Subject, 
			 @Text,
			 @ParentId,
			 @EntityTypeId,
			 @EntityId,
			 @CreatedBy,
		     @IsDeleted)

      SET @Id = SCOPE_IDENTITY()
END


GO
